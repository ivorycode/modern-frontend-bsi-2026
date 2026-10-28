import Button from "./Button";
import Form from "./Form";
import OptimisticButton from "./ButtonOptimistic";
import { loadCountFromDb } from "./serverData";
import styles from "@/app/component.module.css";

export default async function Container() {
  const dataFromDb = await loadCountFromDb();

  console.log("Rendering Container Component");
  return (
    <div className={styles.container}>
      <h1>Container</h1>
      <p>Rendering on server</p>
      <h1>Initial Count: {dataFromDb}</h1>
      <Form intitialCount={dataFromDb} />
      <Button intitialCount={dataFromDb} />
      <OptimisticButton count={dataFromDb} />
    </div>
  );
}
