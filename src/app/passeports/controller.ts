/**
 * Passeports controller
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createPgColumns, createPgValues, executeSql, getColumns, sql } from "../../db";

export async function addPasseport(values: any) {
      return executeSql(`SELECT max(tracabilite) FROM passeports WHERE annee = '${values["annee"]}'`).then(async res => {
            const tmp:string = res[0 as keyof object]["max" as keyof object];
            values["tracabilite" as keyof object] = isNaN(+tmp) ? 1 : +tmp + 1;
            return await executeSql(`INSERT INTO passeports (${createPgColumns("passeports", values)}) VALUES (${createPgValues("passeports", values)}) RETURNING id`);
      });
};

export async function updatePasseport(values: any, id: number) {
      const cols = getColumns("passeports");
      const datas = cols.filter(e => values[e]);
      return await executeSql(`UPDATE passeports SET ${datas.map(e => `"${e}" = '${values[e]}'`).join()} WHERE id = ${ id }`)
      .then(async () => await executeSql(`SELECT * FROM passeports WHERE id = ${ id }`));
};