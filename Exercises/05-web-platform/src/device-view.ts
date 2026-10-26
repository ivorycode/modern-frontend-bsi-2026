import { loadDevices } from "./api.ts";
import { CATEGORY_LABELS, type Device } from "./device.ts";
import { requireElement } from "./dom.ts";

/** Was die Seite gerade anzeigt. */
export type ViewState =
  | { kind: "initial" }
  | { kind: "loading" }
  | { kind: "success"; devices: Device[] }
  | { kind: "empty" }
  | { kind: "error"; message: string };

/** Verbindet die Auswahl des Szenarios mit der Anzeige der Geräte. */
export function setupDeviceView(root: HTMLElement, apiBaseUrl: string): void {
  const source = requireElement(root, 'select[name="source"]', HTMLSelectElement);
  const output = requireElement(root, ".output", HTMLElement);

  function render(state: ViewState): void {
    switch (state.kind) {
      case "initial":
        output.replaceChildren(message("Wählen Sie ein Szenario.", "hint"));
        break;
      case "loading":
        output.replaceChildren(message("Lädt …", "loading", "status"));
        break;
      case "empty":
        output.replaceChildren(message("Keine Geräte vorhanden.", "hint"));
        break;
      case "error":
        output.replaceChildren(message(state.message, "error", "alert"));
        break;
      case "success":
        output.replaceChildren(renderSummary(state.devices), renderTable(state.devices));
        break;
      default:
        assertNever(state);
    }
  }

  async function showDevices(path: string): Promise<void> {
    render({ kind: "loading" });
    const devices = await loadDevices(new URL(path, apiBaseUrl));
    render({ kind: "success", devices });
  }

  source.addEventListener("change", () => {
    void showDevices(source.value);
  });

  render({ kind: "initial" });
}

function renderSummary(devices: readonly Device[]): HTMLParagraphElement {
  const available = devices.filter((device) => device.available);
  const summary = document.createElement("p");
  summary.className = "summary";
  summary.textContent = `${devices.length} Geräte, davon ${available.length} verfügbar`;
  return summary;
}

function renderTable(devices: readonly Device[]): HTMLTableElement {
  const table = document.createElement("table");
  const head = table.createTHead().insertRow();
  for (const title of ["Nr.", "Gerät", "Kategorie", "Status"]) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = title;
    head.append(th);
  }

  const body = table.createTBody();
  for (const device of devices) {
    body.append(renderRow(device));
  }
  return table;
}

function renderRow(device: Device): HTMLTableRowElement {
  const row = document.createElement("tr");
  const status = cell(device.available ? "verfügbar" : "ausgeliehen");
  status.className = device.available ? "status-available" : "status-lent";
  row.append(
    cell(String(device.id)),
    cell(device.name),
    cell(CATEGORY_LABELS[device.category]),
    status,
  );
  return row;
}

function cell(content: string): HTMLTableCellElement {
  const td = document.createElement("td");
  td.textContent = content;
  return td;
}

function message(text: string, className: string, role?: string): HTMLParagraphElement {
  const paragraph = document.createElement("p");
  paragraph.className = className;
  paragraph.textContent = text;
  if (role) paragraph.setAttribute("role", role);
  return paragraph;
}

/** Meldet einen Compilerfehler, wenn ein Fall der Union nicht behandelt ist. */
function assertNever(value: never): never {
  throw new Error(`Unbehandelter Fall: ${JSON.stringify(value)}`);
}
