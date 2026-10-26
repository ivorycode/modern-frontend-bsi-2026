import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App.tsx";
import "./style.css";

const root = document.getElementById("root");
if (!root) throw new Error("Element #root fehlt in index.html.");

createRoot(root).render(
  <StrictMode>
    {/* Clientseitiges Routing mit der History API: echte Pfade wie /claims/4. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
