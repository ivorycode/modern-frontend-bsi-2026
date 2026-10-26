import { z } from "zod";

// Fehlermeldungen von Zod auf Deutsch.
z.config(z.locales.de());

export const categorySchema = z.enum(["laptop", "monitor", "beamer", "headset"]);

/** Ein Gerät, wie es die API liefert. */
export const deviceSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  category: categorySchema,
  available: z.boolean(),
});

export const deviceListSchema = z.array(deviceSchema);

/** Eingaben für ein neues Gerät; Nummer und Verfügbarkeit vergibt der Server. */
export const newDeviceSchema = z.object({
  name: z.string().trim().min(1, "Bitte einen Namen eingeben."),
  category: categorySchema,
});

export type Category = z.infer<typeof categorySchema>;
export type Device = z.infer<typeof deviceSchema>;
export type NewDevice = z.infer<typeof newDeviceSchema>;

export const CATEGORY_LABELS: Record<Category, string> = {
  laptop: "Laptop",
  monitor: "Monitor",
  beamer: "Beamer",
  headset: "Headset",
};
