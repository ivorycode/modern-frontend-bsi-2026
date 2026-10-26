<!-- Startseite: Liste aller Schadenfälle mit Suche. -->
<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate, statusLabels } from "../claims/claim.ts";
import { filterClaims } from "../claims/filter-claims.ts";
import { useClaims } from "../claims/use-claims.ts";

const { claims, reload } = useClaims();
const route = useRoute();
const router = useRouter();

// URL-Zustand: Der Suchbegriff steht als ?q=… in der Adresse.
// v-model liest über get und schreibt über set.
const query = computed({
  get: () => (typeof route.query.q === "string" ? route.query.q : ""),
  // replace: Nicht jeder Tastendruck soll einen Eintrag in der History erzeugen.
  set: (value: string) => router.replace({ query: value === "" ? {} : { q: value } }),
});

// Abgeleiteter Zustand: berechnet aus Liste und Suchbegriff, nie gespeichert.
const filteredClaims = computed(() =>
  claims.value.status === "success" ? filterClaims(claims.value.data, query.value) : [],
);
</script>

<template>
  <h1>Schadenfälle</h1>

  <div class="toolbar">
    <label class="search">
      Suche
      <input v-model="query" type="search" placeholder="Titel, Kunde oder Schadennummer" />
    </label>
    <button type="button" @click="reload">Aktualisieren</button>
  </div>

  <p v-if="claims.status === 'loading'" class="loading" role="status">Lädt …</p>

  <p v-else-if="claims.status === 'error'" class="error" role="alert">{{ claims.message }}</p>

  <template v-else>
    <p class="count">{{ filteredClaims.length }} von {{ claims.data.length }} Schadenfällen</p>
    <p v-if="filteredClaims.length === 0" class="hint">Keine Schadenfälle gefunden.</p>
    <table v-else>
      <thead>
        <tr>
          <th>Nummer</th>
          <th>Titel</th>
          <th>Kunde</th>
          <th>Status</th>
          <th>Gemeldet am</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="claim in filteredClaims" :key="claim.id">
          <td>{{ claim.number }}</td>
          <td>
            <RouterLink :to="`/claims/${claim.id}`">{{ claim.title }}</RouterLink>
          </td>
          <td>{{ claim.customer }}</td>
          <td>
            <span :class="['status', `status-${claim.status}`]">{{
              statusLabels[claim.status]
            }}</span>
          </td>
          <td>{{ formatDate(claim.reportedOn) }}</td>
        </tr>
      </tbody>
    </table>
  </template>
</template>
