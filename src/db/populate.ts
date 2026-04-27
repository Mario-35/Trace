
import path from 'path';
import { asyncForEach } from "../helpers/asyncForEach";
import { dataBase } from "./base";
import { executeSql } from "./executeSql";
import { readFileSync } from 'fs';
import { createPgColumns, createPgValues } from '.';

export async function populate() {
    asyncForEach(Object.keys(dataBase).filter(e => e !== "fichiers"), async (tableName: string) => {
        if (dataBase[tableName].save === true) {
            const file = readFileSync(path.join(__dirname, "../import", tableName + '.json'), 'utf-8');
            const datas = JSON.parse(file);
            const queries:string[] = [];
            Object(datas[tableName]).forEach((data: any) => {
                delete data["id"];                
                queries.push(`INSERT INTO ${tableName} (${createPgColumns(tableName, data)}) VALUES (${createPgValues(tableName, data)})`);
            });
            executeSql(queries).catch((error) => {
                console.error(error);
                return false;
            });
        }
    });
    return true
}
