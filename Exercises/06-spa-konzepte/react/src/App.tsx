import { Link, Outlet, Route, Routes } from "react-router";
import { ClaimListPage } from "./pages/ClaimListPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";

/** Routen der Anwendung. */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ClaimListPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

/** Rahmen für alle Seiten; `<Outlet />` zeigt die Seite der aktuellen Route. */
function Layout() {
  return (
    <>
      <header className="app-header">
        <Link to="/">Muster Versicherung</Link>
        <span className="framework">React</span>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
