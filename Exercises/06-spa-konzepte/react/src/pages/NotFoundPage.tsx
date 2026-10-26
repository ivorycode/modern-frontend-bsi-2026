import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <>
      <h1>Seite nicht gefunden</h1>
      <p>
        Diese Adresse gibt es nicht. <Link to="/">Zur Übersicht</Link>
      </p>
    </>
  );
}
