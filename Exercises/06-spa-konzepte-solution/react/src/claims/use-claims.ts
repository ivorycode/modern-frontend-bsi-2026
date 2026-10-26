// Serverzustand: Laden, Fehler und Daten der API als React-Hooks.

import { useCallback, useEffect, useState } from "react";
import type { Claim, ClaimSummary } from "./claim.ts";
import { ClaimNotFoundError, fetchClaim, fetchClaims } from "./claim-api.ts";

/** Zustand einer Anfrage an die API. */
export type RemoteData<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

/** Lädt die Liste der Schadenfälle; `reload` lädt sie erneut. */
export function useClaims(): { claims: RemoteData<ClaimSummary[]>; reload: () => void } {
  // Jeder Ladevorgang hat eine Nummer. Ein Ergebnis gilt nur für den Ladevorgang,
  // zu dem es gehört; solange es fehlt, lädt die Liste.
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<{ version: number; claims: RemoteData<ClaimSummary[]> }>();

  useEffect(() => {
    // Bricht den Request ab, wenn die Komponente verschwindet oder neu lädt.
    const controller = new AbortController();
    fetchClaims(controller.signal).then(
      (data) => setResult({ version, claims: { status: "success", data } }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setResult({ version, claims: { status: "error", message: messageOf(error) } });
      },
    );
    return () => controller.abort();
  }, [version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const claims = result?.version === version ? result.claims : { status: "loading" as const };
  return { claims, reload };
}

/** Lädt einen Schadenfall; `not-found`, wenn die API die ID nicht kennt. */
export function useClaim(id: string): RemoteData<Claim> | { status: "not-found" } {
  const [result, setResult] = useState<{
    id: string;
    claim: RemoteData<Claim> | { status: "not-found" };
  }>();

  useEffect(() => {
    const controller = new AbortController();
    fetchClaim(id, controller.signal).then(
      (data) => setResult({ id, claim: { status: "success", data } }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof ClaimNotFoundError) setResult({ id, claim: { status: "not-found" } });
        else setResult({ id, claim: { status: "error", message: messageOf(error) } });
      },
    );
    return () => controller.abort();
  }, [id]);

  return result?.id === id ? result.claim : { status: "loading" };
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "Unbekannter Fehler beim Laden.";
}
