/**
 * Sites controller
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { readId } from "../../controller";
import { createPgInsert, createPgUpdate, executeSql, sql } from "../../db";
import { dataBase } from "../../db/base";

export async function addSite(values: any) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`${createPgInsert(dataBase.sites.name, values)} RETURNING id`)
            .then(async (res: any) => {
                  resolve(res[0].id);
            }).catch (error => {
                  console.error(error);
                  reject(error);
            });
      });
};

export async function updateSite(values: any, id: number) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`${createPgUpdate(dataBase.sites.name, values)} WHERE id = ${ id }`)
            .then(async () => {
                  const ret = await readId(dataBase.sites.name, id)
                  .then((ret: any) => {
                        resolve(ret[0].id);
                  }).catch (error => {
                        console.error(error);
                        reject(error);
                  })
            }).catch (error => {
                  console.error(error);
                  reject(error);
            });
      });
};

