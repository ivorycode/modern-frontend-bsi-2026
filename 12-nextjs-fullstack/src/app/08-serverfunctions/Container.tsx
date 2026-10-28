import Child from "./Child";
import { revalidatePath } from "next/cache";
import { updateCount } from "@/app/db/db";
import { loadCountFromDb } from "./serverData";
import {
  updateCountServer,
  updateCountServerWithValue,
} from "./serverFunction";
import styles from "@/app/component.module.css";

export default async function Container() {
  const dataFromDb = await loadCountFromDb();

  // DEMO: inline server functions
  // async function updateCountServer() {
  //   "use server";
  //   console.log("Container Component -> updating count ...");
  // }
  //
  // async function updateCountServer(data: FormData) {
  //   "use server";
  //   const newValueRaw = data.get("val") as string;
  //   const newValue = parseInt(newValueRaw);
  //   // data should be validated here ... ie using Zod ...
  //
  //   console.log("Container Component -> updating count ...", newValue);
  //   await updateCount(newValue);
  //   revalidatePath("/");
  // }
  //
  // async function increaseCountServer() {
  //   "use server";
  //   console.log("Container Component -> updating count ...", dataFromDb);
  //   // 🤯🤯🤯 we can use `dataFromDb` in a method that is called from the client ...
  //   await updateCount(dataFromDb + 1);
  //   revalidatePath("/");
  // }

  console.log("Rendering Container Component");
  return (
    <div className={styles.container}>
      <h1>Container</h1>
      <p>Rendering on server</p>
      <h1>{dataFromDb}</h1>
      {/*<form action={updateCountServer}>*/}
      {/*  <button type="submit">Update</button>*/}
      {/*</form>      */}
      <form action={updateCountServer}>
        <input
          className={styles.input}
          name={"val"}
          defaultValue={dataFromDb}
        />
        <button type="submit">Update</button>
      </form>
      {/*<button onClick={increaseCountServer}>Increase</button>*/}
      <Child count={dataFromDb} />
      {/*<Child count={dataFromDb} updateFn={updateCountServerWithValue} />*/}
      {/*<Child count={dataFromDb} updateFn={increaseCountServer} />*/}
    </div>
  );
}
