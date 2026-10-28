import styled from "styled-components";
import type { PricingPlan } from "../../data.ts";

/**
 * Ansatz 2: styled-components (Runtime CSS-in-JS)
 * ------------------------------------------------------------
 * - Styles als Tagged Template Literals direkt in JS/TS
 * - Dynamisches Styling über Props (siehe $highlighted)
 * - ABER: Styles werden zur LAUFZEIT generiert und injiziert
 *   → Runtime-Overhead, inkompatibel mit React Server Components
 * - Status 2026: Maintenance Mode — für NEUE Projekte nicht mehr
 *   empfohlen; hier als "historisch wichtiges Muster" gezeigt.
 * ------------------------------------------------------------
 * Transient Props ($highlighted statt highlighted) verhindern,
 * dass die Prop ins DOM durchgereicht wird.
 */

const Card = styled.article<{ $highlighted?: boolean }>`
  background: var(--surface);
  color: var(--ink);
  border: 1px solid ${(p) => (p.$highlighted ? "var(--accent)" : "var(--edge)")};
  outline: ${(p) => (p.$highlighted ? "2px solid var(--accent)" : "none")};
  outline-offset: -2px;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
`;

const Badge = styled.span`
  justify-self: start;
  background: var(--accent);
  color: var(--accent-contrast);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 700;

  span {
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--ink-muted);
    margin-left: 0.4rem;
  }
`;

const Features = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--ink-muted);

  li::before {
    content: "✓ ";
    color: var(--accent);
    font-weight: 700;
  }
`;

const Cta = styled.button`
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: var(--accent-contrast);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.1);
  }
`;

export function PricingCardStyled({ plan }: { plan: PricingPlan }) {
  return (
    <Card $highlighted={plan.highlighted}>
      {plan.highlighted && <Badge>Beliebt</Badge>}
      <Name>{plan.name}</Name>
      <Price>
        {plan.price}
        <span>{plan.period}</span>
      </Price>
      <Features>
        {plan.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </Features>
      <Cta>{plan.cta}</Cta>
    </Card>
  );
}
