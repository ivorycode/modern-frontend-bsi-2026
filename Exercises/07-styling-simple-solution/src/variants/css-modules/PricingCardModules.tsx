import type { PricingPlan } from "../../data.ts";
import styles from "./PricingCard.module.css";

/**
 * Ansatz 1: CSS Modules
 * - `styles.card` ist ein generierter, lokal gescopter Klassenname
 * - Colocation: .module.css liegt neben der Komponente
 * - Bedingte Klassen manuell (oder mit `clsx`) zusammensetzen
 */
export function PricingCardModules({ plan }: { plan: PricingPlan }) {
  const cardClass = plan.highlighted ? `${styles.card} ${styles.highlighted}` : styles.card;

  return (
    <article className={cardClass}>
      {plan.highlighted && <span className={styles.badge}>Beliebt</span>}
      <h3 className={styles.name}>{plan.name}</h3>
      <div className={styles.price}>
        {plan.price}
        <span className={styles.period}>{plan.period}</span>
      </div>
      <ul className={styles.features}>
        {plan.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <button className={styles.cta}>{plan.cta}</button>
    </article>
  );
}
