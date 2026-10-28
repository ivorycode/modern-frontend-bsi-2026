import { join } from "node:path";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { z } from "zod";

const PORT = 3155;

// Prüfung auf dem Server: Daten von aussen sind unbekannt, bis das Schema sie bestätigt.
const Registration = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich"),
  email: z.email("Ungültige E-Mail-Adresse"),
});
type Registration = z.infer<typeof Registration>;

const fastify = Fastify();

// Liefert die Dateien aus client/ aus (index.html, app.js)
await fastify.register(fastifyStatic, { root: join(import.meta.dirname, "../client") });
// Verarbeitet multipart/form-data, Voraussetzung für request.formData()
await fastify.register(fastifyMultipart, { attachFieldsToBody: true });

fastify.post("/api/json", async (request, reply) => {
  const result = Registration.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send(validationError(result.error));
  }

  const submittedData: Registration = result.data;
  console.log("JSON empfangen:", submittedData);

  return { success: true, data: submittedData };
});

fastify.post("/api/form", async (request, reply) => {
  const formData = await request.formData();
  const result = Registration.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return reply.status(400).send(validationError(result.error));
  }

  const submittedData: Registration = result.data;
  console.log("Formulardaten empfangen:", submittedData);

  return { success: true, data: submittedData };
});

function validationError(error: z.ZodError) {
  return { success: false, errors: z.flattenError(error).fieldErrors };
}

await fastify.listen({ port: PORT });
console.log(`Seite: http://localhost:${PORT}/`);
