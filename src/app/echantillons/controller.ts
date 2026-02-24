import { readId } from "../../controller";
import { executeSql, getColumns, sql } from "../../db";
import { dataBase } from "../../db/base";

export async function readEchantillons(passeport?: number) {
      return  passeport 
            ? await sql`SELECT id, programme, site, responsable, prelevement, identification, etat FROM echantillons WHERE passeport = ${ passeport } ORDER BY identification`
            : await sql`SELECT id, programme, site, responsable, prelevement, identification, etat FROM echantillons ORDER BY identification`
};

export async function addEchantillon(values: any) {
      const queries:string[] = [];
      let tmpCode: string | undefined = undefined;
      // Create list of columns
      const tableColumns = Object.keys(dataBase.echantillons.columns).filter(e => values[e as keyof object] !== undefined );
      // Create list insert into
      const insertInto = tableColumns.map(e => `"${e}"`);
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

                  // const tmpCode: string =  values["identification" as keyof object].slice(0,12);
                  // Create list insert values
                  const vals = tableColumns.map(e => tempVal[e as keyof object]).map(e => `'${e}'`);
                  // Go
                  queries.push(`INSERT INTO echantillons (${insertInto.join()}) VALUES (${ vals.join()})`);
            });
      } else {
            // Get the nb of lines to insert
            const nb= +values["nombre" as keyof object];
            // Get the start number
            const start= +values["numero" as keyof object];
            // create start string for identification
            tmpCode =  values["identification" as keyof object].slice(0,12);
            // create identification codes
            const codesIdentification:string[] = []
            for (var i = 0; i < nb; i++)
                  codesIdentification.push(tmpCode + String(i + start).padStart(4, '0'));
            // loop in identifications
            codesIdentification.forEach((identification) => {
                  values["identification" as keyof object] = identification;
                  // Go
                  queries.push(`INSERT INTO echantillons (${insertInto.join()}) VALUES (${ tableColumns.map(e => values[e]).map(e => `'${e}'`).join()})`);
            });            
            executeSql(queries);
            // executeSql(queries);
            const mai = `INSERT INTO selections (ids) SELECT ARRAY_AGG(id) FROM echantillons WHERE identification IN ('${ codesIdentification.join("','") }') RETURNING id`;
            const ret = await sql.unsafe(mai);
            return {selection : ret[0].id};
      }
      executeSql(queries);
      return {identification : tmpCode};
};

export async function updateEchantillon(values: any, id: number) {
      const cols = getColumns("echantillons");
      const datas = cols.filter(e => values[e]);
      return await executeSql(`UPDATE echantillons SET ${datas.map(e => `"${e}" = '${values[e]}'`).join()} WHERE id = ${ id }`)
      .then(async res => {
            return await sql`SELECT * FROM echantillons WHERE id = ${ id }`
      })

};

export async function readEchantillonFromIdentification(identification: string) {
      return await executeSql(`SELECT id, programme, site, responsable, prelevement, identification, etat FROM echantillons WHERE identification = '${ identification }'`);
};