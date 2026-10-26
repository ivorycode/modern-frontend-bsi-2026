<!-- Detailansicht eines Schadenfalls unter /claims/:id. -->
<script setup lang="ts">
import { useClaim } from "../claims/use-claims.ts";
import ClaimDetails from "../components/ClaimDetails.vue";

// Routenparameter als Prop, weil die Route `props: true` setzt: bei /claims/4 ist id === "4"
const props = defineProps<{ id: string }>();
// Als Funktion übergeben, damit useClaim neu lädt, wenn sich die ID ändert.
const claim = useClaim(() => props.id);
</script>

<template>
  <p v-if="claim.status === 'loading'" class="loading" role="status">Lädt …</p>
  <template v-else-if="claim.status === 'not-found'">
    <h1>Schadenfall nicht gefunden</h1>
    <p>Es gibt keinen Schadenfall mit der ID {{ id }}.</p>
  </template>
  <p v-else-if="claim.status === 'error'" class="error" role="alert">{{ claim.message }}</p>
  <ClaimDetails v-else :claim="claim.data" />
</template>
