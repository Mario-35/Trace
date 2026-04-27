/**
 * Passeports controller
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { readId } from "../../controller";
import { createPgColumns, createPgValues, executeSql, getColumns, sql } from "../../db";
import { dataBase } from "../../db/base";

export async function addPasseport(values: any) {
      return executeSql(`SELECT max(tracabilite) FROM ${dataBase.passeports.name} WHERE annee = '${values["annee"]}'`).then(async res => {
            const tmp:string = res[0 as keyof object]["max" as keyof object];
            values["tracabilite" as keyof object] = isNaN(+tmp) ? 1 : +tmp + 1;
            return await executeSql(`INSERT INTO ${dataBase.passeports.name} (${createPgColumns(dataBase.passeports.name, values)}) VALUES (${createPgValues(dataBase.passeports.name, values)}) RETURNING id`);
      });
};

export async function updatePasseport(values: any, id: number) {
      const cols = getColumns(dataBase.passeports.name);
      const datas = cols.filter(e => values[e]);
      return await executeSql(`UPDATE ${dataBase.passeports.name} SET ${datas.map(e => `"${e}" = '${values[e]}'`).join()} WHERE id = ${ id }`)
      .then(async () => await readId(dataBase.passeports.name,  id));
};