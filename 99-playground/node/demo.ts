console.log("TypeScript Demo \n\n ");

console.log("\n\n ");

interface Person {
  firstName: string;
  movies: string[];
}

async function fetchLuke(): Promise<Person> {
  const lukeResponse = await fetch(`https://swapi.info/api/people/1`);
  const luke = (await lukeResponse.json()) as Person;
  return luke;
}

async function main() {
  console.log("Starting ...");
  const luke = await fetchLuke();
  // 💥 KABOOM! - the following line throws a TypeError at runtime
  console.log(`Luke appears in ${luke.movies.length} movies.`);
}

main();



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
//   const luke = PersonSchema.parse(await lukeResponse.json());
//   return luke;
// }