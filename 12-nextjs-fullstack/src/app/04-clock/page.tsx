import Clock from "./Clock";
import styles from "@/app/component.module.css";

export default function Page() {
  console.log("Rendering Clock Page");
  return (
    <div className={styles.wrapper}>
      <Clock />
    </div>
  );
}
