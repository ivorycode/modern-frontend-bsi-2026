"use client";

import { use } from "react";
import styles from "@/app/component.module.css";

type ChildProps = { backendData?: string };

export default function Child({ backendData }: ChildProps) {
  console.log("Rendering Child Component", backendData);

  return (
    <div className={styles.client}>
      <h1>Child.</h1>
      <p>Rendering on client</p>
      <h3>Backend data:</h3>
      <h1>{backendData}</h1>
    </div>
  );
}
