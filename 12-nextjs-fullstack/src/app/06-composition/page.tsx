import Container from "./Container";
import styles from "@/app/component.module.css";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <Container />
    </div>
  );
}
