console.log("TypeScript Demo \n\n ");

console.log("Running Demo Code 2 ...");

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
