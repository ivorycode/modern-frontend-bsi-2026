import { queryFromDB } from "./serverData";
import { DemoHack } from "@/app/03-streaming/DemoHack";
import styles from "@/app/component.module.css";

export async function Backend({ messageId }: { messageId: number }) {
  const serverData = await queryFromDB(messageId);
  const now = new Date().toLocaleTimeString();

  return (
    <div className={styles.server}>
      <h1>{serverData}</h1>
      <p>{now}</p>
      <DemoHack />
    </div>
  );
}
