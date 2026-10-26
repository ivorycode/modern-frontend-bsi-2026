import { requireElement } from "./dom.ts";
import { loadRegistrations, type ViewState } from "./load-registrations.ts";
import { nextId, STATUS_LABELS, type Registration } from "./registration.ts";

/** Verbindet die Auswahl der Datenquelle mit der Anzeige der Anmeldungen. */
export function setupRegistrationView(root: HTMLElement, fetchFn: typeof fetch): void {
  const source = requireElement(root, "select", HTMLSelectElement);
  const output = requireElement(root, ".output", HTMLElement);

  function render(state: ViewState): void {
    switch (state.kind) {
      case "initial":
        output.replaceChildren(message("Wählen Sie eine Datenquelle.", "hint"));
        break;
      case "loading":
        output.replaceChildren(message("Lädt …", "loading", "status"));
        break;
      case "empty":
        output.replaceChildren(message("Keine Anmeldungen vorhanden.", "hint"));
        break;
      case "error":
        output.replaceChildren(message(state.message, "error", "alert"));
        break;
      case "success":
        output.replaceChildren(
          renderSummary(state.registrations),
          renderTable(state.registrations),
        );
        break;
      default:
        assertNever(state);
    }
  }

  source.addEventListener("change", () => {
    void loadRegistrations(source.value, fetchFn, render);
  });

  render({ kind: "initial" });
}

function renderSummary(registrations: readonly Registration[]): HTMLParagraphElement {
  const confirmed = registrations.filter((registration) => registration.status === "confirmed");
  const summary = document.createElement("p");
  summary.className = "summary";
  summary.textContent =
    `${registrations.length} Anmeldungen, davon ${confirmed.length} bestätigt` +
    ` · nächste Anmeldenummer: ${nextId(registrations)}`;
  return summary;
}

function renderTable(registrations: readonly Registration[]): HTMLTableElement {
  const table = document.createElement("table");
  const head = table.createTHead().insertRow();
  for (const title of ["Nr.", "Name", "E-Mail", "Status", "Platz"]) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = title;
    head.append(th);
  }

  const body = table.createTBody();
  const byName = registrations.toSorted((a, b) => a.name.localeCompare(b.name, "de-CH"));
  for (const registration of byName) {
    body.append(renderRow(registration));
  }
  return table;
}

function renderRow(registration: Registration): HTMLTableRowElement {
  const row = document.createElement("tr");

  const email = document.createElement("a");
  email.href = `mailto:${registration.email}`;
  email.textContent = registration.email;

  const status = cell(STATUS_LABELS[registration.status]);
  status.className = `status status-${registration.status}`;

  row.append(
    cell(String(registration.id)),
    cell(registration.name),
    cell(email),
    status,
    cell(registration.seat === undefined ? "–" : String(registration.seat)),
  );
  return row;
}

function cell(content: string | Node): HTMLTableCellElement {
  const td = document.createElement("td");
  td.append(content);
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
