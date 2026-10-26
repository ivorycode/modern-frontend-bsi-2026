/** Sucht ein Element und prüft seinen Typ; wirft einen Fehler, wenn es fehlt. */
export function requireElement<T extends Element>(
  root: ParentNode,
  selector: string,
  type: new () => T,
): T {
  const element = root.querySelector(selector);
  if (!(element instanceof type)) {
    throw new Error(`Element «${selector}» nicht gefunden`);
  }
  return element;
}
