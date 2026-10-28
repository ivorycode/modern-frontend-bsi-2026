"use client";

import { updateCountServerWithValue } from "./serverFunction";
import styles from "@/app/component.module.css";

type ChildProps = {
  count: number;
  updateFn?: (data: number) => Promise<void>;
};

export default function Child({ count, updateFn }: ChildProps) {
  async function handleClick() {
    console.log("handling click ...");
    updateCountServerWithValue(count + 1);
    // updateFn(count + 1);
  }

  console.log("rendering Child");
  return (
    <div className={styles.client}>
      <h2>Display of Child.</h2>
      <p>Rendering on client</p>
      <div>
        <button onClick={handleClick}>Increment</button>
      </div>
    </div>
  );
}
