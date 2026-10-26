<!-- Rahmen für alle Seiten; <RouterView> zeigt die Seite der aktuellen Route. -->
<template>
  <header class="app-header">
    <RouterLink to="/">Muster Versicherung</RouterLink>
    <span class="framework">Vue</span>
  </header>
  <main>
    <RouterView />
  </main>
</template>
