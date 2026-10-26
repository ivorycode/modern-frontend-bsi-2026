// Serverzustand: Laden, Fehler und Daten der API als Composables.

import { onScopeDispose, ref, toValue, watchEffect, type MaybeRefOrGetter, type Ref } from "vue";
import type { Claim, ClaimSummary } from "./claim.ts";
import { ClaimNotFoundError, fetchClaim, fetchClaims } from "./claim-api.ts";

/** Zustand einer Anfrage an die API. */
export type RemoteData<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

/** Lädt die Liste der Schadenfälle; `reload` lädt sie erneut. */
export function useClaims(): { claims: Ref<RemoteData<ClaimSummary[]>>; reload: () => void } {
  const claims = ref<RemoteData<ClaimSummary[]>>({ status: "loading" });
  let controller: AbortController | undefined;

  function reload(): void {
    // Einen laufenden Request abbrechen, bevor ein neuer startet.
    controller?.abort();
    const { signal } = (controller = new AbortController());
    claims.value = { status: "loading" };
    fetchClaims(signal).then(
      (data) => (claims.value = { status: "success", data }),
      (error: unknown) => {
        if (!signal.aborted) claims.value = { status: "error", message: messageOf(error) };
      },
    );
  }

  reload();
  // Request abbrechen, wenn die Komponente verschwindet.
  onScopeDispose(() => controller?.abort());
  return { claims, reload };
}

/**
 * Lädt einen Schadenfall; `not-found`, wenn die API die ID nicht kennt.
 * `id` darf ein Wert, eine Ref oder eine Funktion sein, z. B. `() => props.id`.
 * Ändert sich die ID, lädt die Funktion den neuen Schadenfall.
 */
export function useClaim(
  id: MaybeRefOrGetter<string>,
): Ref<RemoteData<Claim> | { status: "not-found" }> {
  const claim = ref<RemoteData<Claim> | { status: "not-found" }>({ status: "loading" });

  watchEffect((onCleanup) => {
    const currentId = toValue(id);
    const controller = new AbortController();
    onCleanup(() => controller.abort());
    claim.value = { status: "loading" };
    fetchClaim(currentId, controller.signal).then(
      (data) => (claim.value = { status: "success", data }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        claim.value =
          error instanceof ClaimNotFoundError
            ? { status: "not-found" }
            : { status: "error", message: messageOf(error) };
      },
    );
  });

  return claim;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "Unbekannter Fehler beim Laden.";
}
