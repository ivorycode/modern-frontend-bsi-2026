"use client";
import Shared from "./Shared";
import styles from "@/app/component.module.css";

type ChildProps = { children?: React.ReactNode };

export default function Child({ children }: ChildProps) {
  console.log("rendering Child");
  return (
    <div className={styles.client}>
      <h2>Display of Child.</h2>
      <p>Rendering on client</p>
      {children}
    </div>
  );
}
