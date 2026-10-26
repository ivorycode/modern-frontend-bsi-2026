<!-- Startseite: Liste aller Schadenfälle mit Suche. -->
<script setup lang="ts">
import { ref, watch } from "vue";
import { formatDate, statusLabels, type ClaimSummary } from "../claims/claim.ts";
import { useClaims } from "../claims/use-claims.ts";

const { claims, reload } = useClaims();

// Suchbegriff aus dem Eingabefeld
const query = ref("");

// Liste, die in der Tabelle angezeigt wird
const filteredClaims = ref<ClaimSummary[]>([]);

// Sobald die Schadenfälle geladen sind, die Tabelle füllen.
watch(claims, (value) => {
  if (value.status === "success") filteredClaims.value = value.data;
});

// Bei jeder Eingabe die Tabelle neu filtern.
watch(query, (value) => {
  if (claims.value.status === "success") {
    filteredClaims.value = claims.value.data.filter((claim) =>
      claim.title.toLowerCase().includes(value.toLowerCase()),
    );
  }
});
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
          <td>{{ claim.title }}</td>
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
