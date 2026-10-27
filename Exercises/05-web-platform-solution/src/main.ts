import "./style.css";
import { requireElement } from "./dom.ts";
import { setupDeviceView } from "./device-view.ts";

/** Adresse der Geräte-API (`npm run api`); ein anderer Origin als diese Seite. */
const API_BASE_URL = "http://localhost:3105";

setupDeviceView(requireElement(document, "main", HTMLElement), API_BASE_URL);
