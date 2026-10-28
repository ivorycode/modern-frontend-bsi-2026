import styles from "../component.module.css";
import { Simple } from "@/app/01-simple/Simple";

export const dynamic = "force-dynamic";

export default function Page() {
  console.log("Rendering Simple Page");
  return (
    <div className={styles.wrapper}>
      <Simple />
    </div>
  );
}
