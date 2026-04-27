import { executeSql } from "../../db";
import { dataBase } from "../../db/base";

export async function addSelection(values: any) {
      return await executeSql(`INSERT INTO ${dataBase.selections.name} (ids) VALUES ('{${values}}') RETURNING id`);      
}