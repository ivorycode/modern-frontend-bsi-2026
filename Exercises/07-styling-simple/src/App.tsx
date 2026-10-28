import { useState } from "react";
import { proPlan } from "./data.ts";
import { ProfileCard, demoProfile } from "./exercise/ProfileCard.tsx";
import { PricingCardModules } from "./variants/css-modules/PricingCardModules.tsx";
import { PricingCardStyled } from "./variants/styled-components/PricingCardStyled.tsx";
import { PricingCardTailwind } from "./variants/tailwind/PricingCardTailwind.tsx";
import { PricingCardVE } from "./variants/vanilla-extract/PricingCardVE.tsx";

/**
 * Demo: Dieselbe PricingCard, vier Styling-Ansätze.
 * Der Theme-Switch setzt nur EIN Attribut — alle vier Karten
 * reagieren, weil alle auf denselben Design Tokens basieren.
 */
export function App() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  }

  return (
    <div className="demo-shell">
      <header className="demo-header">
        <h1>React Styling-Ansätze im Vergleich</h1>
        <button onClick={toggleTheme}>{dark ? "☀️ Light Mode" : "🌙 Dark Mode"}</button>
      </header>

      <div className="demo-grid">
        <section>
          <h2>1 · CSS Modules</h2>
          <PricingCardModules plan={proPlan} />
        </section>
        <section>
          <h2>2 · styled-components</h2>
          <PricingCardStyled plan={proPlan} />
        </section>
        <section>
          <h2>3 · vanilla-extract</h2>
          <PricingCardVE plan={proPlan} />
        </section>
        <section>
          <h2>4 · Tailwind v4</h2>
          <PricingCardTailwind plan={proPlan} />
        </section>
        {/* Übung: Die Überschrift benennt den Abschnitt; die Tests finden die Karte darüber. */}
        <section aria-labelledby="uebung-css-modules">
          <h2 id="uebung-css-modules">Übung · ProfileCard (CSS Modules)</h2>
          <ProfileCard profile={demoProfile} />
        </section>
      </div>
    </div>
  );
}
