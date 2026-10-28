"use server";

import { revalidatePath } from "next/cache";
import { getCount, updateCount } from "@/app/db/db";

export async function addCountFormOnServer(prevState: number, data: FormData) {
  console.log("DB: updating count ...", Object.fromEntries(data.entries()));
  const currentCount = parseInt((await getCount()) ?? "0");
  const newCount = currentCount + parseInt((data.get("val") as string) ?? "1");
  await updateCount(newCount);
  return newCount;
}

export async function addCountNumberOnServer(prevState: number, val: number) {
  console.log("DB: updating count ...", val);
  const currentCount = parseInt((await getCount()) ?? "0");
  const newCount = currentCount + val;
  await updateCount(newCount);
  return newCount;
}

export async function addCountOnServerThenRevalidate(val: number) {
  console.log("DB: updating count ...", val);
  const currentCount = parseInt((await getCount()) ?? "0");
  const newCount = currentCount + val;
  await updateCount(newCount);
  revalidatePath("/");
}
