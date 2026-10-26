// Typen für Single-File Components, damit TypeScript-Dateien `.vue`-Dateien importieren können.
// Die genaue Typprüfung der Templates übernimmt `vue-tsc` (Teil von `npm run check`).
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}
