# Musterlösung zu Übung 5.5: Formulare

Aufgabe: [Übung 5.5](../05-forms/README.md)

```sh
npm install
npm run dev
```

Seite: `http://localhost:3155/`. Das Zod-Schema und die Prüfung stehen in `server/server.ts`; `npm run check` prüft die Typen.

```sh
curl -X POST http://localhost:3155/api/json \
  -H "Content-Type: application/json" \
  -d '{"name": " ", "email": "keine-adresse"}'
```
