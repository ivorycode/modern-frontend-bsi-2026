import { useEffect, useState, type ChangeEvent } from "react";
import { formatDate, statusLabels, type ClaimSummary } from "../claims/claim.ts";
import { useClaims } from "../claims/use-claims.ts";

/** Startseite: Liste aller Schadenfälle mit Suche. */
export function ClaimListPage() {
  const { claims, reload } = useClaims();

  // Suchbegriff aus dem Eingabefeld
  const [query, setQuery] = useState("");

  // Liste, die in der Tabelle angezeigt wird
  const [filteredClaims, setFilteredClaims] = useState<ClaimSummary[]>([]);

  // Sobald die Schadenfälle geladen sind, die Tabelle füllen.
  useEffect(() => {
    if (claims.status === "success") setFilteredClaims(claims.data);
  }, [claims]);

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setQuery(value);
    if (claims.status === "success") {
      setFilteredClaims(
        claims.data.filter((claim) => claim.title.toLowerCase().includes(value.toLowerCase())),
      );
    }
  }

  return (
    <>
      <h1>Schadenfälle</h1>

      <div className="toolbar">
        <label className="search">
          Suche
          <input
            type="search"
            placeholder="Titel, Kunde oder Schadennummer"
            value={query}
            onChange={handleQueryChange}
          />
        </label>
        <button type="button" onClick={reload}>
          Aktualisieren
        </button>
      </div>

      {claims.status === "loading" && (
        <p className="loading" role="status">
          Lädt …
        </p>
      )}

      {claims.status === "error" && (
        <p className="error" role="alert">
          {claims.message}
        </p>
      )}

      {claims.status === "success" && (
        <>
          <p className="count">
            {filteredClaims.length} von {claims.data.length} Schadenfällen
          </p>
          {filteredClaims.length === 0 ? (
            <p className="hint">Keine Schadenfälle gefunden.</p>
          ) : (
            <ClaimTable claims={filteredClaims} />
          )}
        </>
      )}
    </>
  );
}

function ClaimTable({ claims }: { claims: ClaimSummary[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nummer</th>
          <th>Titel</th>
          <th>Kunde</th>
          <th>Status</th>
          <th>Gemeldet am</th>
        </tr>
      </thead>
      <tbody>
        {claims.map((claim) => (
          <tr key={claim.id}>
            <td>{claim.number}</td>
            <td>{claim.title}</td>
            <td>{claim.customer}</td>
            <td>
              <span className={`status status-${claim.status}`}>{statusLabels[claim.status]}</span>
            </td>
            <td>{formatDate(claim.reportedOn)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
