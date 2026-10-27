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