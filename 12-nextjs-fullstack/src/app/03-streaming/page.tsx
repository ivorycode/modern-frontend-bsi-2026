import { Suspense } from "react";
import { Backend } from "./Backend";
import { Spinner } from "@/app/Spinner";
import styles from "@/app/component.module.css";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <h3>Backend Data:</h3>
      <div className={styles.column}>
        <div>
          <Suspense fallback={<Spinner />}>
            <Backend messageId={1} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<Spinner />}>
            <Backend messageId={2} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<Spinner />}>
            <Backend messageId={3} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<Spinner />}>
            <Backend messageId={5} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
