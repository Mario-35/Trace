/**
 * Echantillons controller
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { readId } from "../../controller";
import { createPgUpdates, createPgValues, executeSql, sql } from "../../db";
import { dataBase } from "../../db/base";

export async function addEchantillon(values: any) {
      // store all queries
      const queries:string[] = [];
      // store analyzes case nombreOuAnalyses is true
      let analyzes:string[] = [];
      // store identification for return request
      let tmpCode: string | undefined = undefined;
      // Create list of columns
      const tableColumns = Object.keys(dataBase.echantillons.columns).filter(e => values[e as keyof object]);
      // Create list insert into
      const insertInto = tableColumns;
      // Get the start number
      const start = +values["numero" as keyof object];            
      // If excel instert
      if (values["excel" as keyof object]) {
            // get the excel file saved
            const excelFile = await sql`SELECT * FROM ${ sql("excels") } WHERE id = ${ +values["excel" as keyof object] }`;
            // Create list of excel columns
            const excelCols = excelFile[0]["datas" as keyof object]["columns"];
            // lopp excel lines
            Object.values(excelFile[0]["datas" as keyof object]["datas"]).forEach((tmp: any, index: number) => {
                  // clone line
                  const tempVal = JSON.parse(JSON.stringify(values));
                  // modify the lines with excel values
                  Object.keys(excelCols).forEach(key => {
                        delete tempVal[key];
                        tempVal[key] = tmp[excelCols[key as keyof object]]; // TODO CHANGE VALUES
                  });
                  // create identification
                  if (tempVal["identification"] )
                        tempVal["identification"] = values["identification" as keyof object].slice(0,12) + String(+tmp[excelCols["echantillon" as keyof object]] ||  index + start).padStart(4, '0');

                  if (!tmpCode)  tmpCode =  values["identification" as keyof object].slice(0,12);

                  // Go
                  queries.push(`INSERT INTO echantillons (${insertInto.map(e => `"${e}"`).join()}) VALUES (${ createPgValues("echantillons", tempVal, insertInto)})`);
            });
      } else {           
            // Get the nb of lines to insert
            let nb= +values["nombre" as keyof object];
            // loop on analyses
            if (!values["nombreOuAnalyses" as keyof object]) {
                  analyzes = values["analyses" as keyof object].split(",");
                  nb = analyzes.length;
            }
            // create start string for identification
            tmpCode =  values["identification" as keyof object].slice(0,12);
            // create identification codes
            const codesIdentification:string[] = []
            for (var i = 0; i < nb; i++)
                  codesIdentification.push(tmpCode + String(i + start).padStart(4, '0'));
            // loop in identifications
            codesIdentification.forEach((identification, i) => {
                  values["identification" as keyof object] = identification;
                   if (!values["nombreOuAnalyses" as keyof object])
                        values["analyses"] = analyzes[i];
                  queries.push(`INSERT INTO echantillons (${insertInto.join()}) VALUES (${createPgValues("echantillons", values)})`);
            });

            // execute all queries
            return new Promise(async function (resolve, reject) {
                  return executeSql(queries).then(async () => {
                        // create selection return (usefull for print stickers)
                        const selectionId = await sql.unsafe(`INSERT INTO selections (ids) SELECT ARRAY_AGG(id) FROM echantillons WHERE identification IN ('${ codesIdentification.join("','") }') RETURNING id`);
                        resolve({selection : selectionId[0].id});
                  }).catch (error => {
                        reject(error);
                  });
            });

      }
      // execute all queries
      return new Promise(async function (resolve, reject) {
            return await executeSql(queries)
            .then(async () => {
                  resolve({identification : tmpCode});
            }).catch (error => {
                  console.error(error);
                  reject(error);
            });
      });
};

export async function updateEchantillon(values: any, id: number) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`UPDATE echantillons SET ${createPgUpdates("echantillons", values)} WHERE id = ${ id }`)
            .then(async () => {
                  const ret = await sql`SELECT * FROM echantillons WHERE id = ${ id }`
                  resolve(ret);
            }).catch (error => {
                  console.error(error);
                  reject(error);
            });
      });
};

