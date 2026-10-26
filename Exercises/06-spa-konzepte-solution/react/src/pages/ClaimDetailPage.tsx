import { useParams } from "react-router";
import { useClaim } from "../claims/use-claims.ts";
import { ClaimDetails } from "../components/ClaimDetails.tsx";

/** Detailansicht eines Schadenfalls unter /claims/:id. */
export function ClaimDetailPage() {
  // Routenparameter: bei /claims/4 ist id === "4"
  const { id = "" } = useParams();
  const claim = useClaim(id);

  switch (claim.status) {
    case "loading":
      return (
        <p className="loading" role="status">
          Lädt …
        </p>
      );
    case "not-found":
      return (
        <>
          <h1>Schadenfall nicht gefunden</h1>
          <p>Es gibt keinen Schadenfall mit der ID {id}.</p>
        </>
      );
    case "error":
      return (
        <p className="error" role="alert">
          {claim.message}
        </p>
      );
    case "success":
      return <ClaimDetails claim={claim.data} />;
  }
}
