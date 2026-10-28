import { getData } from "@/app/db/db";
import { timestampWithMillis } from "@/app/util";

export async function queryFromDB(messageId: number) {
  console.log(
    `Querying DB for id ${messageId} (${timestampWithMillis(new Date())})`,
  );
  const dbData = await getData(messageId);

  console.log(
    `Loaded data for id ${messageId} from the DB (${timestampWithMillis(new Date())}): `,
    dbData,
  );
  return dbData;
}
