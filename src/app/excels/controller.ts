import { executeSql } from "../../db";
import { dataBase } from "../../db/base";
import { escapeSimpleQuotes } from "../../helpers/escapeSimpleQuotes";

export async function addExcel(values: any) { 
      return await executeSql(`INSERT INTO ${dataBase.excels.name} (datas) VALUES ('${escapeSimpleQuotes(JSON.stringify(values))}') RETURNING id`);
}