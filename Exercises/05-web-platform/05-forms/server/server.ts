import { join } from "node:path";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";

const PORT = 3055;

const fastify = Fastify();

// Liefert die Dateien aus client/ aus (index.html, app.js)
await fastify.register(fastifyStatic, { root: join(import.meta.dirname, "../client") });
// Verarbeitet multipart/form-data, Voraussetzung für request.formData()
await fastify.register(fastifyMultipart, { attachFieldsToBody: true });

fastify.post("/api/json", async (request) => {
  const submittedData = request.body;
  console.log("JSON empfangen:", submittedData);

  return { success: true, data: submittedData };
});

fastify.post("/api/form", async (request) => {
  const formData = await request.formData();
  const submittedData = Object.fromEntries(formData);
  console.log("Formulardaten empfangen:", submittedData);

  return { success: true, data: submittedData };
});

await fastify.listen({ port: PORT });
console.log(`Seite: http://localhost:${PORT}/`);
