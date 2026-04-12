/**
 * Controllers
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { executeSql, sql } from "../db";
import { dataBase } from "../db/base";


export async function readAll(table: string) {
      return await executeSql(`SELECT * FROM "${table}"`)
};

export async function readAlSearch(table: string, search: string) {
       const tableColumns = Object.keys(dataBase[table as keyof object]["columns" as keyof object]);
      return await executeSql(`SELECT * FROM "${table}" WHERE ${tableColumns.map(e => `"${e}" LIKE '%${search}%'`).join(" OR ")}`);
};

export async function readId(table: string, id: number) {
      return await executeSql(`SELECT * FROM "${table}" WHERE id = ${ id }`);
};

export async function readIds(table: string, ids: number[]) {
      return await executeSql(`SELECT * FROM "${table}" WHERE id IN (${ ids.join() })`);
};

export async function readIdentifications(table: string, ientifications: string[]) {
      return await executeSql(`SELECT * FROM "${table}" WHERE id IN ('${ ientifications.join("','") }')`);
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


