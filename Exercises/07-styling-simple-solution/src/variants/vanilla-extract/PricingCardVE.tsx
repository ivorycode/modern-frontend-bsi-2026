import type { PricingPlan } from "../../data.ts";
import * as css from "./pricingCard.css.ts";

/**
 * Ansatz 3: vanilla-extract (Zero-Runtime)
 * - Import aus einer .css.ts-Datei: `css.card` ist typsicher
 * - `card` ist ein styleVariants-Objekt → Auswahl per Key
 */
export function PricingCardVE({ plan }: { plan: PricingPlan }) {
  return (
    <article className={css.card[plan.highlighted ? "highlighted" : "default"]}>
      {plan.highlighted && <span className={css.badge}>Beliebt</span>}
      <h3 className={css.name}>{plan.name}</h3>
      <div className={css.price}>
        {plan.price}
        <span className={css.period}>{plan.period}</span>
      </div>
      <ul className={css.features}>
        {plan.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <button className={css.cta}>{plan.cta}</button>
    </article>
  );
}
