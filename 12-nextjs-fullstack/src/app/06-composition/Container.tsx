import Child from "./Child";
import Shared from "./Shared";
import styles from "@/app/component.module.css";

export default async function Container() {
  console.log("Rendering Container Component");
  return (
    <div className={styles.container}>
      <h1>Container</h1>
      <p>Rendering on server</p>
      <Child>
        <Shared />
      </Child>
    </div>
  );
}
