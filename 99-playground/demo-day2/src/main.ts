import './style.css'
import heroImg from './assets/hero.png'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import { setupCounter } from './counter.ts'


// // DEMO: Runtime Type-Safety
// interface Person {
//   firstName: string;
//   movies: string[];
// }
//
// async function fetchLuke(): Promise<Person> {
//   const lukeResponse = await fetch(`https://swapi.info/api/people/1`);
//   const luke = (await lukeResponse.json()) as Person;
//   return luke;
// }
//
// async function main() {
//   console.log("Starting ...");
//   const luke = await fetchLuke();
//   // 💥 KABOOM! - the following line throws a TypeError at runtime
//   console.log(`Luke appears in ${luke.movies.length} movies.`);
// }
//
// main();

// DEMO: #### Runtime Validierung von Hand
// // Assertion Function: prüft zur Laufzeit und verengt den Typ von unknown auf Person.
// function assertPerson(value: unknown): asserts value is Person {
//   if (typeof value !== "object" || value === null) {
//     throw new Error("Person erwartet ein Objekt");
//   }
//   const candidate = value as Record<string, unknown>;
//   if (typeof candidate.firstName !== "string") {
//     throw new Error("Person.firstName muss ein String sein");
//   }
//   if (
//     !Array.isArray(candidate.movies) ||
//     !candidate.movies.every((movie) => typeof movie === "string")
//   ) {
//     throw new Error("Person.movies muss ein Array von Strings sein");
//   }
// }
//
// async function fetchLuke(): Promise<Person> {
//   const lukeResponse = await fetch(`https://swapi.info/api/people/1`);
//   const luke: unknown = await lukeResponse.json();
//   assertPerson(luke);
//   return luke;
// }

// DEMO: #### Runtime Validierung mit Zod
// import { z } from "zod";
//
// // Das Schema prüft zur Laufzeit; der Typ wird daraus abgeleitet.
// const PersonSchema = z.object({
//   firstName: z.string(),
//   movies: z.array(z.string()),
// });
// type Person = z.infer<typeof PersonSchema>;
//
//
// async function fetchLuke(): Promise<Person> {
//   const lukeResponse = await fetch(`https://swapi.info/api/people/1`);
//   const luke: unknown = await lukeResponse.json();
//   try {
//     return PersonSchema.parse(luke);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       throw new Error(
//         `Ungültige API-Antwort für Luke Skywalker:\n${z.prettifyError(error)}`,
//         { cause: error },
//       );
//     }
//     throw error;
//   }
// }





document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
    <img src="${viteLogo}" class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
  </div>
  <button id="counter" type="button" class="counter"></button>
</section>

<div class="ticks"></div>

<section id="next-steps">
  <div id="docs">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
    <h2>Documentation</h2>
    <p>Your questions, answered</p>
    <ul>
      <li>
        <a href="https://vite.dev/" target="_blank">
          <img class="logo" src="${viteLogo}" alt="" />
          Explore Vite
        </a>
      </li>
      <li>
        <a href="https://www.typescriptlang.org" target="_blank">
          <img class="button-icon" src="${typescriptLogo}" alt="">
          Learn more
        </a>
      </li>
    </ul>
  </div>
  <div id="social">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
    <h2>Connect with us</h2>
    <p>Join the Vite community</p>
    <ul>
      <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
      <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
      <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
      <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
