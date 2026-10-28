# Übung 5.5: Formulare – JSON, FormData und Prüfung auf dem Server

Eine Seite sendet eine Anmeldung (Name, E-Mail) auf zwei Arten an einen Server: als JSON mit `fetch` und als Formular mit `FormData`. Der Browser prüft die Eingaben, der Server ([Fastify](https://fastify.dev/)) nimmt alles an. Sie umgehen die Prüfung im Browser und ergänzen die Prüfung auf dem Server mit [Zod](https://zod.dev/).

Jeder Schritt hat einen ausklappbaren Lösungshinweis. Die Musterlösung liegt in [05-forms-solution](../05-forms-solution).

## Schritt 1: Starten und beide Varianten vergleichen

Im Ordner `Exercises/05-web-platform/05-forms`:

```sh
npm install
npm run dev
```

Node führt `server/server.ts` direkt aus und startet bei Änderungen neu. Öffnen Sie `http://localhost:3055/` in Chrome mit dem Network-Tab und senden Sie beide Varianten ab. Lesen Sie `client/app.js` und `server/server.ts`.

Vergleichen Sie bei beiden Requests den Header `Content-Type` und den Tab **Payload**.

<details>
<summary>Lösungshinweis</summary>

| Variante | `Content-Type`                                   | Body                                                  |
| -------- | ------------------------------------------------ | ----------------------------------------------------- |
| JSON     | `application/json` (im Code gesetzt)             | `{"name":"Anna Muster","email":"anna@example.com"}`   |
| Formular | `multipart/form-data; boundary=----WebKitForm…`  | Teile, getrennt durch die Boundary, ein Teil pro Feld |

`new FormData(form)` liest alle Felder mit `name`-Attribut aus dem Formular. Übergibt man `FormData` als `body`, setzt der Browser den `Content-Type` samt Boundary selbst; ein eigener `Content-Type`-Header würde die Boundary entfernen und den Request unlesbar machen. Mit `multipart/form-data` lassen sich auch Dateien hochladen.

Auf dem Server liest `request.formData()` den Body wieder als Web-Standard-`FormData` ein, dieselbe API wie im Browser.

</details>

## Schritt 2: Die Prüfung im Browser umgehen

Senden Sie bei beiden Varianten einen leeren Namen. Senden Sie danach dieselben ungültigen Daten direkt an den Server:

```sh
curl -X POST http://localhost:3055/api/json \
  -H "Content-Type: application/json" \
  -d '{"name": " ", "email": "keine-adresse"}'

curl -X POST http://localhost:3055/api/form -F "name="
```

- Wer prüft die Eingaben im Formular, bevor `app.js` sie prüft? Geben Sie im Formular `x` als E-Mail ein.
- Was nimmt der Server an?

<details>
<summary>Lösungshinweis</summary>

Im Formular prüft zuerst der Browser selbst: `type="email"` verlangt eine syntaktisch gültige Adresse, und ohne `novalidate` am `<form>` wird das `submit`-Event gar nicht ausgelöst. Danach prüft `validateFields` in `app.js`.

Der Server nimmt alles an und antwortet mit Status 200, auch einen Namen aus Leerzeichen, eine ungültige Adresse oder ein fehlendes Feld. Die Prüfung im Browser verbessert die Bedienung, schützt aber nichts: Jeder kann Requests mit `curl`, den DevTools («Copy as fetch») oder einem eigenen Programm senden.

</details>

## Schritt 3: Prüfung auf dem Server mit Zod

Ergänzen Sie in `server/server.ts` für beide Endpunkte dieselbe Prüfung mit einem Zod-Schema:

- `name`: String, nach dem Entfernen von Leerzeichen am Anfang und Ende nicht leer
- `email`: gültige E-Mail-Adresse

Bei ungültigen Daten antwortet der Server mit Status **400** und den Fehlermeldungen pro Feld. `submittedData` soll danach einen Typ haben statt `unknown`. Prüfen Sie mit den `curl`-Befehlen aus Schritt 2 und mit `npm run check`.

<details>
<summary>Lösungshinweis</summary>

```ts
import { z } from "zod";

const Registration = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich"),
  email: z.email("Ungültige E-Mail-Adresse"),
});
type Registration = z.infer<typeof Registration>;

fastify.post("/api/json", async (request, reply) => {
  const result = Registration.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    });
  }

  const submittedData: Registration = result.data;
  console.log("JSON empfangen:", submittedData);
  return { success: true, data: submittedData };
});
```

Für `/api/form` gleich mit `Registration.safeParse(Object.fromEntries(formData))`. Ein hochgeladenes `File` statt eines Strings lehnt das Schema ebenfalls ab.

`safeParse` wirft nicht, sondern liefert ein Ergebnis mit `success`. Nach der Prüfung von `result.success` kennt TypeScript den Typ von `result.data`. `trim()` verändert den Wert: Der Server speichert `"Anna"`, auch wenn `" Anna "` gesendet wurde.

Das Schema liesse sich auch im Browser verwenden; dann gelten dieselben Regeln an beiden Stellen. Die Prüfung auf dem Server bleibt trotzdem nötig.

</details>
