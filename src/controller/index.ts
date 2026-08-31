/**
 * Controllers
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { executeSql, sql } from "../db";
import { dataBase } from "../db/base";
import { escapeSimpleQuotes } from "../helpers/escapeSimpleQuotes";


export async function readAll(table: string) {
      return await executeSql(`SELECT * FROM "${table}"`)
};

export async function readAlSearch(table: string, search: string) {
       const tableColumns = Object.keys(dataBase[table as keyof object]["columns" as keyof object]);
      return await executeSql(`SELECT * FROM "${table}" WHERE ${tableColumns.map(e => `"${e}" LIKE '%${escapeSimpleQuotes(search)}%'`).join(" OR ")}`);
};

export async function readId(table: string, id: number) {
      const tableColumns = Object.keys(dataBase[table as keyof object]["columns" as keyof object]).filter(e => dataBase[table as keyof object]["columns" as keyof object][e]["calculate"]).map(e => `${dataBase[table as keyof object]["columns" as keyof object][e]["calculate"]} AS ${e}`);
      return await executeSql(`SELECT ${tableColumns ? `${tableColumns.join()}, *`: "*"} FROM "${table}" WHERE id = ${ id }`);
};

export async function readIds(table: string, ids: number[]) {
      return await executeSql(`SELECT * FROM "${table}" WHERE id IN (${ ids.join() })`);
};

export function verifyBody(values: any) {
      try {
            if (!values) return undefined;
            if (Object.keys(values).length < 1) return undefined;
      } catch (error) {
            console.error(error);            
            return undefined;            
      }
      return values
}

export async function deleteId(table: string, id: number) {
      return await executeSql(`DELETE FROM ${ sql(table) } WHERE id = ${ id }`)
};


