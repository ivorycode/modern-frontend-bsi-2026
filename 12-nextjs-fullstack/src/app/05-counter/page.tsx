import Counter from "./Counter";
import styles from "@/app/component.module.css";

export default function Page() {
  console.log("Rendering Counter Page");
  return (
    <div className={styles.wrapper}>
      <Counter />
    </div>
  );
}
