import { executeSql } from "../../db";

export async function addSelection(values: any) {
      return await executeSql(`INSERT INTO selections (ids) VALUES ('{${values}}') RETURNING id`);      
}