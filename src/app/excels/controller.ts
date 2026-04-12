import { executeSql } from "../../db";
import { escapeSimpleQuotes } from "../../helpers/escapeSimpleQuotes";

export async function addExcel(values: any) { 
      return await executeSql(`INSERT INTO excels (datas) VALUES ('${escapeSimpleQuotes(JSON.stringify(values))}') RETURNING id`);
}