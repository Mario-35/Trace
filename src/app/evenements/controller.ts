
import { createPgInsert, createPgUpdate, executeSql, sql } from "../../db";
import { dataBase } from "../../db/base";

export async function addEvenement(values: any) {
      const valuesCopy = {... values};
      valuesCopy["date"] = `${valuesCopy["date"]} ${valuesCopy["time"]}`;
      return new Promise(async function (resolve, reject) {
            if (values["serie"]) {
                  return await executeSql(`SELECT identification, etat AS saveetat FROM ${dataBase.echantillons.name} WHERE identification LIKE CONCAT((SELECT SUBSTRING ( identification FROM 1 FOR 12 ) FROM ${dataBase.echantillons.name} WHERE id =${ values["serie"] }), '%') GROUP BY identification, etat`)
                  .then(async (echantillons: any) => {
                        const queries: string[] = [];
                        Object(echantillons).forEach((echantillon: any) => {
                              if (values["etat"] !== "---- Laisser ----")
                                    queries.push(`UPDATE ${dataBase.echantillons.name} SET etat = '${values["etat"]}' WHERE identification = ${echantillon["identification"]}`);                              
                              queries.push(`${createPgInsert(dataBase.evenements.name, {...valuesCopy, ... echantillon} )}`);                              
                        });                        
                        return await executeSql(queries).then(async () => {
                              resolve(true);
                        }).catch (error => {
                              reject(error);
                        });
                  }).catch (error => {
                        reject(error.detail);
                  });
             } else return await executeSql(`${createPgInsert(dataBase.evenements.name, values)} RETURNING id`)
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
                  const ret = await sql`SELECT * FROM ${dataBase.evenements.name} WHERE id = ${ id }`;
                  resolve(ret[0].id);
            }).catch (error => {
                  console.error(error);
                  reject(error);
            });
      });
};

