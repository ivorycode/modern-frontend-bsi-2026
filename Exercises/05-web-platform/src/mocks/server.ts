import { setupServer } from "msw/node";
import { handlers } from "./handlers.ts";

/** Fängt Requests in den Tests ab und beantwortet sie mit den Handlern. */
export const server = setupServer(...handlers);
