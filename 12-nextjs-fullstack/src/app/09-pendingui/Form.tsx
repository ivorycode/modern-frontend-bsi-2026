"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { addCountFormOnServer } from "./serverFunction";
import styles from "@/app/component.module.css";
import { Spinner } from "@/app/Spinner";

type ChildProps = {
  intitialCount: number;
};

export default function Child({ intitialCount }: ChildProps) {
  const [count, addCountAction, isPending] = useActionState(
    addCountFormOnServer,
    intitialCount,
  );

  console.log("Rendering Form Component", count);
  return (
    <div className={styles.client}>
      <h2>Display of Form</h2>
      <p>Rendering on client</p>
      <h1>Count: {count}</h1>
      <div>
        <form action={addCountAction}>
          <input type="number" name="val" defaultValue={2} />
          <button type="submit" disabled={isPending}>
            {isPending ? "Saving" : "Add"}
          </button>
          <FormStatus />
        </form>
      </div>
    </div>
  );
}

export function FormStatus() {
  const status = useFormStatus();
  return (
    <div className={styles.center}>
      {status.pending ? <Spinner /> : <h3>Saved</h3>}
    </div>
  );
}
