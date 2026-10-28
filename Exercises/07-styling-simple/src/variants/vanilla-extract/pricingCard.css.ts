import { style, styleVariants, globalStyle } from "@vanilla-extract/css";

/**
 * Ansatz 3: vanilla-extract (Zero-Runtime CSS-in-JS)
 * ------------------------------------------------------------
 * - Styles werden in TypeScript geschrieben (.css.ts)
 *   → volle Typsicherheit, Autocomplete, Refactoring
 * - ABER: Zur BUILD-Zeit wird daraus statisches CSS extrahiert
 *   → kein Runtime-Overhead, kompatibel mit RSC/SSR
 * - Dynamik zur Laufzeit nur über Varianten-Klassen oder
 *   CSS Custom Properties (bewusste Einschränkung!)
 * - Für Themes bietet vanilla-extract zusätzlich
 *   createThemeContract()/createTheme() — hier nutzen wir die
 *   globalen Tokens, um die Vergleichbarkeit zu erhalten.
 */

const cardBase = style({
  background: "var(--surface)",
  color: "var(--ink)",
  border: "1px solid var(--edge)",
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-card)",
  padding: "1.5rem",
  display: "grid",
  gap: "1rem",
});

// Varianten statt Prop-Interpolation: Dynamik wird auf eine
// endliche Menge vorab generierter Klassen abgebildet.
export const card = styleVariants({
  default: [cardBase],
  highlighted: [
    cardBase,
    {
      borderColor: "var(--accent)",
      outline: "2px solid var(--accent)",
      outlineOffset: "-2px",
    },
  ],
});

export const badge = style({
  justifySelf: "start",
  background: "var(--accent)",
  color: "var(--accent-contrast)",
  fontSize: "0.7rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: "0.25rem 0.6rem",
  borderRadius: 999,
});

export const name = style({
  margin: 0,
  fontSize: "1.1rem",
});

export const price = style({
  fontSize: "2rem",
  fontWeight: 700,
});

export const period = style({
  fontSize: "0.85rem",
  fontWeight: 400,
  color: "var(--ink-muted)",
  marginLeft: "0.4rem",
});

export const features = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: "0.5rem",
  fontSize: "0.9rem",
  color: "var(--ink-muted)",
});

globalStyle(`${features} li::before`, {
  content: "✓ ",
  color: "var(--accent)",
  fontWeight: 700,
});

export const cta = style({
  border: "none",
  borderRadius: 8,
  background: "var(--accent)",
  color: "var(--accent-contrast)",
  fontSize: "0.95rem",
  fontWeight: 600,
  padding: "0.7rem 1rem",
  cursor: "pointer",
  transition: "filter 0.15s ease",
  ":hover": {
    filter: "brightness(1.1)",
  },
});
