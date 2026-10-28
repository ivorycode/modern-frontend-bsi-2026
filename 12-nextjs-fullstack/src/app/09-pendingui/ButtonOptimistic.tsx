"use client";
import { useOptimistic, useTransition } from "react";

import { addCountOnServerThenRevalidate } from "./serverFunction";
import styles from "@/app/component.module.css";

type ChildProps = {
  count: number;
};

export default function OptimisticButton({ count }: ChildProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCount, addOptimistic] = useOptimistic(
    count,
    (count, val: number) => {
      return count + val;
    },
  );

  function handleIncrement() {
    startTransition(async () => {
      addOptimistic(10);
      await addCountOnServerThenRevalidate(10);
    });
  }

  console.log("Rendering Button Component", { optimisticCount, count });
  return (
    <div className={styles.client}>
      <h2>Display of Optimistic Button.</h2>
      <p>Rendering on client</p>
      <h1>Count: {optimisticCount}</h1>
      <div>
        <button onClick={handleIncrement}>
          {isPending ? "Saving" : "Increment"}
        </button>
      </div>
    </div>
  );
}
