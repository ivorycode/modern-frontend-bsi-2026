import type { ChangeEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { formatDate, statusLabels, type ClaimSummary } from "../claims/claim.ts";
import { filterClaims } from "../claims/filter-claims.ts";
import { useClaims } from "../claims/use-claims.ts";

/** Startseite: Liste aller Schadenfälle mit Suche. */
export function ClaimListPage() {
  const { claims, reload } = useClaims();

  // URL-Zustand: Der Suchbegriff steht als ?q=… in der Adresse.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    // replace: Nicht jeder Tastendruck soll einen Eintrag in der History erzeugen.
    setSearchParams(value === "" ? {} : { q: value }, { replace: true });
  }

  // Abgeleiteter Zustand: bei jedem Rendern aus Liste und Suchbegriff berechnet.
  const filteredClaims = claims.status === "success" ? filterClaims(claims.data, query) : [];

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
            <td>
              <Link to={`/claims/${claim.id}`}>{claim.title}</Link>
            </td>
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
