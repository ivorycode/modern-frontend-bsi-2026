import { readServerData } from "@/app/02-backend/serverData";
import styles from "@/app/component.module.css";

export async function Backend() {
  const serverData = await readServerData();

  // DEMO: async data fetching
  // const serverData  = await readServerData();

  const now = new Date().toLocaleTimeString();
  console.log("Rendering Backend Component");
  return (
    <div className={styles.server}>
      <h1>{serverData}</h1>
      <p>{now}</p>
    </div>
  );
}
