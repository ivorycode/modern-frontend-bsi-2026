import { describe, expect, it } from "vite-plus/test";
import { loadSentenceParallel } from "./sentence.ts";
import { createFakeFetchWord, flushPromises } from "./test-helpers.ts";

const WORDS = ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];

describe("loadSentenceParallel", () => {
  it("fragt alle Wörter sofort an und liefert den Satz", async () => {
    const fake = createFakeFetchWord();

    const loading = loadSentenceParallel(fake.fetchWord);
    await flushPromises();

    // Alle Wörter sind angefragt, bevor eine einzige Antwort eingetroffen ist.
    expect(fake.requestedIndexes()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    WORDS.forEach((word, index) => fake.respond(index, word));

    await expect(loading).resolves.toEqual(WORDS);
  });

  it.todo(
    "liefert die Wörter in der Reihenfolge des Satzes, auch wenn die Antworten umgekehrt eintreffen",
  );
  it.todo("lehnt ab, wenn ein Wort nicht geladen werden kann");
});

describe("loadSentenceSequential", () => {
  it.todo("fragt das nächste Wort erst an, wenn das vorherige eingetroffen ist");
  it.todo("lehnt ab, wenn ein Wort nicht geladen werden kann, und fragt keine weiteren Wörter an");
});
