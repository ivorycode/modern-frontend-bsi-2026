import "./style.css";
import { requireElement } from "./dom.ts";
import { setupRegistrationView } from "./registration-view.ts";

/** Wie `fetch`, aber mit künstlicher Verzögerung, damit die Ladeanzeige sichtbar wird. */
const slowFetch: typeof fetch = async (input, init) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return fetch(input, init);
};

setupRegistrationView(requireElement(document, "main", HTMLElement), slowFetch);
