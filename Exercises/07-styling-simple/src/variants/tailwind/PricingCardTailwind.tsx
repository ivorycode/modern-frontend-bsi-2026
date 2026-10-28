import type { PricingPlan } from "../../data.ts";

/**
 * Ansatz 4: Tailwind CSS v4 (Utility-First)
 * ------------------------------------------------------------
 * - Keine eigene CSS-Datei: Styling über Utility-Klassen im Markup
 * - Design Tokens kommen aus dem @theme-Block in index.css
 *   (bg-surface, text-ink, ... sind DORT definierte Tokens)
 * - Scoping-Problem existiert nicht: Utilities sind global,
 *   aber atomar und ohne Seiteneffekte
 * - Trade-off: "hässliches" Markup vs. maximale Konsistenz
 *   und kein Naming-Aufwand
 * - In echten Projekten: Wiederverwendung über KOMPONENTEN
 *   (genau wie hier), nicht über @apply
 * - Radius und Schatten über die Tokens: rounded-(--radius-card),
 *   shadow-(--shadow-card)
 * - Grössen und Abstände bewusst aus der Skala von Tailwind statt
 *   der freien Werte der anderen drei Ansätze (z. B. text-sm statt
 *   0.85rem). Die Karte sieht deshalb leicht anders aus: Die Skala
 *   ist eine Designentscheidung, keine Einschränkung.
 */
export function PricingCardTailwind({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className={`grid gap-4 rounded-(--radius-card) border bg-surface p-6 text-ink shadow-(--shadow-card) ${
        plan.highlighted
          ? "border-accent outline-2 outline-accent -outline-offset-2"
          : "border-edge"
      }`}
    >
      {plan.highlighted && (
        <span className="justify-self-start rounded-full bg-accent px-2.5 py-1 text-xs font-semibold tracking-widest text-accent-contrast uppercase">
          Beliebt
        </span>
      )}
      <h3 className="m-0 text-lg font-semibold">{plan.name}</h3>
      <div className="text-3xl font-bold">
        {plan.price}
        <span className="ml-1.5 text-sm font-normal text-ink-muted">{plan.period}</span>
      </div>
      <ul className="m-0 grid list-none gap-2 p-0 text-sm text-ink-muted">
        {plan.features.map((f) => (
          <li key={f}>
            <span className="font-bold text-accent">✓ </span>
            {f}
          </li>
        ))}
      </ul>
      <button className="cursor-pointer rounded-lg border-none bg-accent px-4 py-3 text-base font-semibold text-accent-contrast transition hover:brightness-110">
        {plan.cta}
      </button>
    </article>
  );
}
