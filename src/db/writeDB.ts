import { executeSql, getColumns } from ".";
import { asyncForEach } from "../helpers/asyncForEach";
import { dataBase } from "./base";
import fs from 'fs';
import path from 'path';




async function asJson(tableName: string) {
    return executeSql(`SELECT COALESCE( JSON_AGG(t), '[]') AS ${tableName} FROM ( SELECT ${getColumns(tableName).filter(column => dataBase[tableName].columns[column].create !== "")} FROM "${tableName}" ) AS t`)
    .then((res: any) => res)
    .catch((error: Error) => {
        console.error(error);
    })
}

export async function writeDB() {
    const result:any = {};

    asyncForEach(Object.keys(dataBase).filter(e => dataBase[e].create === true), async (tableName: string) => {
        // if (dataBase[tableName].save === true) {
            const datas = await asJson(tableName);
            result[tableName] =  datas[0];
            fs.writeFile(path.join(__dirname, "../import", tableName + '.json'), JSON.stringify(datas[0], null, 4), 'utf8', () => {
                console.log(`Data written to ${tableName}'.json' as JSON.`);
            });
        // }
    });

    return {"status": "ok"}
}

