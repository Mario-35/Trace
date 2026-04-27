
import { createPgInsert, createPgUpdate, executeSql, sql } from "../../db";
import { dataBase } from "../../db/base";

export async function addEvenement(values: any) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`${createPgInsert(dataBase.evenements.name, values)} RETURNING id`)
            .then(async (res: any) => {
                  resolve(res[0].id);
            }).catch (error => {
                  console.error(error);
                  reject(error);
            });
      });
};

export async function updateEvenement(values: any, id: number) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`${createPgUpdate(dataBase.evenements.name, values)} WHERE id = ${ id }`)
            .then(async () => {
                  const ret = await sql`SELECT * FROM ${dataBase.evenements.name} WHERE id = ${ id }`
                  resolve(ret[0].id);
            }).catch (error => {
                  console.error(error);
                  reject(error);
            });
      });
};

