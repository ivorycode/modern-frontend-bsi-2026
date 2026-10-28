"use server";

import { getCount } from "@/app/db/db";

export async function loadCountFromDb() {
  console.log("Querying DB ...");
  const dbCount = await getCount();
  return parseInt(dbCount);
}
