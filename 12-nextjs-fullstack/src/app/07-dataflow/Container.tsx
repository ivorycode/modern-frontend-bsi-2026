import Child from "./Child";
import { queryFromDB } from "./serverData";
import { Suspense } from "react";
import { Spinner } from "@/app/Spinner";
import styles from "@/app/component.module.css";

export default async function Container() {
  console.log("rendering Container");
  return (
    <div className={styles.container}>
      <h1>Container</h1>
      <p>Rendering on server</p>
      <Suspense fallback={<Spinner />}>
        <Content />
      </Suspense>
    </div>
  );
}

/* Demo
 <Suspense fallback={<Spinner />}>
   <Content />
 </Suspense>
 */
// Demo: Show spinner while waiting for data
export async function Content() {
  const dataFromDb = await queryFromDB(5);
  return <Child backendData={dataFromDb} />;
}
