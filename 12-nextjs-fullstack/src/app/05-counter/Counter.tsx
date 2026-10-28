"use client";
import { useState } from "react";
import styles from "@/app/component.module.css";
export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount((count) => count + 1);
  }

  console.log("Rendering Counter");
  return (
    <div className={styles.client}>
      <h1>{count}</h1>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
