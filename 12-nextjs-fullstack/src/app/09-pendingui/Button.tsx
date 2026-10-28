"use client";
import { useActionState, useTransition } from "react";

import { addCountNumberOnServer } from "./serverFunction";
import styles from "@/app/component.module.css";

type ChildProps = {
  intitialCount: number;
};

export default function Button({ intitialCount }: ChildProps) {
  const [isPending, startTransition] = useTransition();
  const [count, addCountAction] = useActionState(
    addCountNumberOnServer,
    intitialCount,
  );

  function handleIncrement() {
    startTransition(() => {
      addCountAction(10);
    });
  }

  console.log("Rendering Button Component", intitialCount);
  return (
    <div className={styles.client}>
      <h2>Display of Button.</h2>
      <p>Rendering on client</p>
      <h1>Count: {count}</h1>
      <div>
        <button onClick={handleIncrement}>
          {isPending ? "Saving" : "Increment"}
        </button>
      </div>
    </div>
  );
}
