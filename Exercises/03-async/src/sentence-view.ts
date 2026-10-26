import { loadSentenceParallel, loadSentenceSequential } from "./sentence.ts";
import { fetchWord } from "./word-api.ts";

/** Verbindet die Seite mit den beiden Lade-Varianten. */
export function setupSentenceView(root: HTMLElement): void {
  const scenarioSelect = root.querySelector<HTMLSelectElement>('select[name="scenario"]')!;
  const parallelButton = root.querySelector<HTMLButtonElement>("button.parallel")!;
  const sequentialButton = root.querySelector<HTMLButtonElement>("button.sequential")!;
  const sentence = root.querySelector<HTMLOutputElement>("output.sentence")!;
  const status = root.querySelector<HTMLElement>(".status")!;
  const error = root.querySelector<HTMLElement>(".error")!;
  const duration = root.querySelector<HTMLElement>(".duration")!;

  /** Lädt ein Wort im gewählten Szenario. */
  function fetchSelectedWord(index: number): Promise<string> {
    return fetchWord(index, scenarioSelect.value);
  }

  function appendWord(word: string): void {
    sentence.value = sentence.value ? `${sentence.value} ${word}` : word;
  }

  function setLoading(loading: boolean): void {
    status.hidden = !loading;
    parallelButton.disabled = loading;
    sequentialButton.disabled = loading;
  }

  async function load(loadSentence: () => Promise<string[]>): Promise<void> {
    sentence.value = "";
    error.hidden = true;
    duration.textContent = "";
    setLoading(true);
    const started = performance.now();

    const words = await loadSentence();
    sentence.value = words.join(" ");
    duration.textContent = `Geladen in ${((performance.now() - started) / 1000).toFixed(1)} s`;

    setLoading(false);
  }

  parallelButton.addEventListener("click", () =>
    load(() => loadSentenceParallel(fetchSelectedWord)),
  );
  sequentialButton.addEventListener("click", () =>
    load(() => loadSentenceSequential(fetchSelectedWord, appendWord)),
  );
}
