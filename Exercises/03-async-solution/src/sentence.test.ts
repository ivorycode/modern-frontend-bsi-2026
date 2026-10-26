import { describe, expect, it, vi } from "vite-plus/test";
import { loadSentenceParallel, loadSentenceSequential } from "./sentence.ts";
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

  it("liefert die Wörter in der Reihenfolge des Satzes, auch wenn die Antworten umgekehrt eintreffen", async () => {
    const fake = createFakeFetchWord();

    const loading = loadSentenceParallel(fake.fetchWord);
    await flushPromises();

    for (let index = WORDS.length - 1; index >= 0; index--) {
      fake.respond(index, WORDS[index]);
      await flushPromises();
    }

    await expect(loading).resolves.toEqual(WORDS);
  });
  it("lehnt ab, wenn ein Wort nicht geladen werden kann", async () => {
    const fake = createFakeFetchWord();

    const loading = loadSentenceParallel(fake.fetchWord);
    await flushPromises();
    fake.fail(4, new Error("Wort 5 konnte nicht geladen werden (HTTP 500)."));

    await expect(loading).rejects.toThrow("Wort 5 konnte nicht geladen werden");
  });
});

describe("loadSentenceSequential", () => {
  it("fragt das nächste Wort erst an, wenn das vorherige eingetroffen ist", async () => {
    const fake = createFakeFetchWord();
    const onWord = vi.fn();

    const loading = loadSentenceSequential(fake.fetchWord, onWord);
    await flushPromises();
    expect(fake.requestedIndexes()).toEqual([0]);

    fake.respond(0, "The");
    await flushPromises();
    expect(onWord).toHaveBeenCalledWith("The");
    expect(fake.requestedIndexes()).toEqual([0, 1]);

    for (let index = 1; index < WORDS.length; index++) {
      fake.respond(index, WORDS[index]);
      await flushPromises();
    }

    await expect(loading).resolves.toEqual(WORDS);
    expect(onWord.mock.calls.map(([word]) => word)).toEqual(WORDS);
  });
  it("lehnt ab, wenn ein Wort nicht geladen werden kann, und fragt keine weiteren Wörter an", async () => {
    const fake = createFakeFetchWord();

    const loading = loadSentenceSequential(fake.fetchWord, () => {});
    await flushPromises();
    fake.fail(0, new Error("Wort 1 konnte nicht geladen werden (HTTP 500)."));

    await expect(loading).rejects.toThrow("Wort 1 konnte nicht geladen werden");
    expect(fake.requestedIndexes()).toEqual([0]);
  });
});
