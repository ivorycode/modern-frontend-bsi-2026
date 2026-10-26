import {
  categoryLabels,
  formatAmount,
  formatDate,
  statusLabels,
  type Claim,
} from "../claims/claim.ts";

/** Zeigt alle Angaben eines Schadenfalls. Reine Darstellung: Die Daten kommen als Prop. */
export function ClaimDetails({ claim }: { claim: Claim }) {
  return (
    <article className="claim-details">
      <p className="claim-number">{claim.number}</p>
      <h1>{claim.title}</h1>
      <dl>
        <dt>Kunde</dt>
        <dd>{claim.customer}</dd>
        <dt>Status</dt>
        <dd>
          <span className={`status status-${claim.status}`}>{statusLabels[claim.status]}</span>
        </dd>
        <dt>Kategorie</dt>
        <dd>{categoryLabels[claim.category]}</dd>
        <dt>Gemeldet am</dt>
        <dd>{formatDate(claim.reportedOn)}</dd>
        <dt>Schadenbetrag</dt>
        <dd>{formatAmount(claim.amount)}</dd>
      </dl>
      <p>{claim.description}</p>
    </article>
  );
}
