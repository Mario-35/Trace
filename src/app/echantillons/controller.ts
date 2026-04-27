/**
 * Echantillons controller
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { readId } from "../../controller";
import { createPgUpdates, createPgValues, executeSql, executeSqlValues, sql } from "../../db";
import { dataBase } from "../../db/base";
import { asyncForEach } from "../../helpers/asyncForEach";

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
      let start = +values["numero" as keyof object]; 
      const codesIdentification:string[] = [];

      // Get the nb of lines to insert
      let nb= +values["nombre" as keyof object];
      // loop on analyses
      if (!values["nombreOuAnalyses" as keyof object]) {
            analyzes = values["analyses" as keyof object].split(",");
            nb = analyzes.length;
      }
      // create start string for identification
      tmpCode =  values["identification" as keyof object].slice(0,12);      
      
      // alicotage insert
      if (values["parent"]) {
            values["etat" as keyof object] = "Prélevé";
            start = 0;
            // get all ids of the selection
            await readId(dataBase.selections.name, +values["selectionaliquote" as keyof object])
            .then(async (ids: any) => {
                  // loop ano all ids
                  await asyncForEach(ids[0].ids, async (id: string) => {
                        await readId(dataBase.echantillons.name, +id).then((echantillon: any) => {
                              for (let loop = 0; loop < nb; loop++) {
                                    start = start + 1;
                                    const identification = tmpCode + String(start).padStart(4, '0');
                                    codesIdentification.push(identification);
                                    values["identification" as keyof object] = identification
                                    values["parent" as keyof object] = echantillon[0 as keyof object]["identification" as keyof object];
                                    values["analyses"] = analyzes[loop];
                                    queries.push(`INSERT INTO ${dataBase.echantillons.name} (${insertInto.join()}) VALUES (${createPgValues(dataBase.echantillons.name, values)})`);
                              }                
                        });
                  }); 
            }).catch (error => {
                  console.error(error);
                  return; 
            });
      } // If excel insert
      else if (values["excel" as keyof object]) {
            // get the excel file saved
            await readId(dataBase.excels.name, +values["excel" as keyof object]).then((excelFile: any) => {
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
                        queries.push(`INSERT INTO ${dataBase.echantillons.name} (${insertInto.map(e => `"${e}"`).join()}) VALUES (${ createPgValues(dataBase.echantillons.name, tempVal, insertInto)})`);
                  });

                  }).catch (error => {
                        console.error(error);
                  });
      } // normal insert
      else {           

            // create identification codes
            for (var i = 0; i < nb; i++)
                  codesIdentification.push(tmpCode + String(i + start).padStart(4, '0'));
            // loop in identifications
            codesIdentification.forEach((identification, i) => {
                  values["identification" as keyof object] = identification;
                   if (!values["nombreOuAnalyses" as keyof object])
                        values["analyses"] = analyzes[i];
                  queries.push(`INSERT INTO ${dataBase.echantillons.name} (${insertInto.join()}) VALUES (${createPgValues(dataBase.echantillons.name, values)})`);
            });
            // execute all queries
            return new Promise(async function (resolve, reject) {
                  return executeSql(queries).then(async () => {
                        // create selection return (usefull for print stickers)
                        const selectionId = await sql.unsafe(`INSERT INTO ${dataBase.selections.name} (ids) SELECT ARRAY_AGG(id) FROM ${dataBase.echantillons.name} WHERE identification IN ('${ codesIdentification.join("','") }') RETURNING id`);
                        resolve({selection : selectionId[0].id});
                  }).catch (error => {
                        console.error(error);
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
            return await executeSql(`UPDATE ${dataBase.echantillons.name} SET ${createPgUpdates(dataBase.echantillons.name, values)} WHERE id = ${ id }`)
            .then(async () => {
                  const ret = await readId(dataBase.echantillons.name, id);
                  resolve(ret);
            }).catch (error => {
                  console.error(error);
                  reject(error);
            });
      });
};

