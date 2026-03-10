
import { createPgInsert, createPgUpdate, executeSql, sql } from "../../db";

export async function addSite(values: any) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`${createPgInsert("sites", values)} RETURNING id`)
            .then(async (res: any) => {
                  resolve(res[0].id);
            }).catch (error => {
                  reject(error);
            });
      });
};

export async function updateSite(values: any, id: number) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`${createPgUpdate("sites", values)} WHERE id = ${ id }`)
            .then(async () => {
                  const ret = await sql`SELECT * FROM sites WHERE id = ${ id }`
                  resolve(ret[0].id);
            }).catch (error => {
                  reject(error);
            });
      });
};

