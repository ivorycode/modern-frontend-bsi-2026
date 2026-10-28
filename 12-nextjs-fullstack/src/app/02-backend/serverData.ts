import { readFile } from "fs/promises";
import { DATA_PATH } from "@/app/db/db";
import { getData } from "@/app/db/db";

export async function readServerData() {
  let serverData = "";
  // serverData = "This is Server Data.";

  // // read current server path
  // serverData = process.cwd();
  //
  // // read data from file
  // serverData = await readFile(`${DATA_PATH}/SERVER_DATA.txt`, "utf8");
  //
  // // read data from database
  serverData = await getData();

  console.log("Server Data: ", serverData);
  return serverData;
}
