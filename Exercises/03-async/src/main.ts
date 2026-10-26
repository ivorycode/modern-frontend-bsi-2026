import "./style.css";
import { setupSentenceView } from "./sentence-view.ts";

setupSentenceView(document.querySelector<HTMLElement>(".sentence-loader")!);
