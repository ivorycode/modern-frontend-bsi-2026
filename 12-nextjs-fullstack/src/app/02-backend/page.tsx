import { Backend } from "@/app/02-backend/Backend";
import { Suspense } from "react";
import { Spinner } from "@/app/Spinner";
import styles from "@/app/component.module.css";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <h3>Backend Data:</h3>
      {/*<Backend />*/}

      {/*// DEMO*/}
      <Suspense fallback={<Spinner />}>
        <Backend />
      </Suspense>
    </div>
  );
}
