import { requireElement } from "./dom.ts";
import { loadRegistrations, type ViewState } from "./load-registrations.ts";
import { nextId, STATUS_LABELS, type Registration } from "./registration.ts";

/** Verbindet die Auswahl der Datenquelle mit der Anzeige der Anmeldungen. */
export function setupRegistrationView(root: HTMLElement, fetchFn: typeof fetch): void {
  const source = requireElement(root, "select", HTMLSelectElement);
  const output = requireElement(root, ".output", HTMLElement);
  const state: ViewState = { isLoading: false };

  function render(): void {
    const parts: Node[] = [];
    if (state.isLoading) parts.push(message("Lädt …", "loading", "status"));
    if (state.error) parts.push(message(state.error, "error", "alert"));
    if (state.data) parts.push(renderSummary(state.data), renderTable(state.data));
    if (!state.isLoading && !state.error && !state.data) {
      parts.push(message("Wählen Sie eine Datenquelle.", "hint"));
    }
    output.replaceChildren(...parts);
  }

  source.addEventListener("change", () => {
    void loadRegistrations(state, source.value, fetchFn, render);
  });

  render();
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
