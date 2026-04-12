
import { createPgInsert, createPgUpdate, executeSql, sql } from "../../db";

export async function addEvenement(values: any) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`${createPgInsert("evenements", values)} RETURNING id`)
            .then(async (res: any) => {
                  resolve(res[0].id);
            }).catch (error => {
                  reject(error);
            });
      });
};

export async function updateEvenement(values: any, id: number) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`${createPgUpdate("evenements", values)} WHERE id = ${ id }`)
            .then(async () => {
                  const ret = await sql`SELECT * FROM evenements WHERE id = ${ id }`
                  resolve(ret[0].id);
            }).catch (error => {
                  reject(error);
            });
      });
};

