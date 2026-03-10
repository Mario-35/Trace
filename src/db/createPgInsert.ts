import { createPgColumns, createPgValues, getColumns } from ".";
import { dataBase } from "./base";

export function createPgInsert(tableName: string, values: any) {
      return `INSERT INTO ${tableName} (${createPgColumns(tableName, values)}) VALUES (${createPgValues(tableName, values)})`;
}