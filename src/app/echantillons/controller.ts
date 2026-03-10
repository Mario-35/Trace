import { readId } from "../../controller";
import { createPgUpdates, createPgValues, executeSql, getColumns, sql } from "../../db";
import { dataBase } from "../../db/base";

export async function readEchantillons(passeport?: number) {
      return  passeport 
            ? await sql`SELECT * FROM echantillons WHERE passeport = ${ passeport } ORDER BY creation DESC`
            : await sql`SELECT * FROM echantillons ORDER BY creation DESC`
};

export async function addEchantillon(values: any) {
      const queries:string[] = [];
      let analyzes:string[] = [];
      let tmpCode: string | undefined = undefined;
      // Create list of columns
      const tableColumns = Object.keys(dataBase.echantillons.columns).filter(e => values[e as keyof object]);
      // Create list insert into
      const insertInto = tableColumns;
      // If excel instert
      if (values["excel" as keyof object]) {
            // get the excel file saved
            const excelFile = await readId("excels",  +values["excel" as keyof object]);
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
                        tempVal["identification"] = values["identification" as keyof object].slice(0,12) + String(+tmp[excelCols["echantillon" as keyof object]] ||  index + 1).padStart(4, '0');

                  if (!tmpCode)  tmpCode =  values["identification" as keyof object].slice(0,12);

                  // Go
                  queries.push(`INSERT INTO echantillons (${insertInto.map(e => `"${e}"`).join()}) VALUES (${ createPgValues("echantillons", tempVal, insertInto)})`);
            });
      } else {           
            // Get the nb of lines to insert
            let nb= +values["nombre" as keyof object];
            if (!values["nombreOuAnalyses" as keyof object]) {
                  analyzes = values["analyses" as keyof object].split(",");
                  nb = analyzes.length;
            }
            // Get the start number
            const start= +values["numero" as keyof object];
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
            return new Promise(async function (resolve, reject) {
                  return executeSql(queries).then(async () => {
                        const selectionId = await sql.unsafe(`INSERT INTO selections (ids) SELECT ARRAY_AGG(id) FROM echantillons WHERE identification IN ('${ codesIdentification.join("','") }') RETURNING id`);
                        resolve({selection : selectionId[0].id});
                  }).catch (error => {
                        reject(error);
                  });
            });

      }
      return new Promise(async function (resolve, reject) {
            return await executeSql(queries)
            .then(async () => {
                  resolve({identification : tmpCode});
            }).catch (error => {
                  console.log(error);
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
                  console.log(error);
                  reject(error);
            });
      });
};

export async function readEchantillonFromIdentification(identification: string) {
      return await executeSql(`SELECT id, programme, site, responsable, prelevement, identification, etat FROM echantillons WHERE identification = '${ identification }'`);
};