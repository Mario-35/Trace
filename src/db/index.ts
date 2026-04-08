/**
 * DB index
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import postgres from "postgres";
import { dataBase } from "./base";
import { executeSql } from "./executeSql";
const pwd = process.env.NODE_ENV === 'production' ? 'postgres' : "mario29";

export const sql = postgres('postgres://postgres:' + pwd + '@localhost:5432/trace', {
    host                 : 'localhost',   // Postgres ip address[s] or domain name[s]
    port                 : 5432,          // Postgres server port[s]
    database             : 'trace',         // Name of database to connect to
    username             : 'postgres',    // Username of database user
    password             :  pwd,     // Password of database user
    debug: true,
    max: 2000,
    connection: {
        application_name: `Echantillons`
    }
});

export function admin(password: string) {    
    return postgres(`postgres://postgres:${password}@localhost:5432/postgres`, {
        host                 : 'localhost',   // Postgres ip address[s] or domain name[s]
        port                 : 5432,          // Postgres server port[s]
        database             : 'postgres',         // Name of database to connect to
        username             : 'postgres',    // Username of database user
        password             : password,     // Password of database user
        debug: true,
        max: 2000,
        connection: {
            application_name: `Trace`
        }
    });
}

export const getColumns = (tableName: string) => Object.keys(dataBase[tableName].columns).filter(e => e != "id");

export function addPartiton(name: string) {
    executeSql(`CREATE TABLE IF NOT EXISTS "echantillon_${name.toLowerCase()}" PARTITION OF echantillons FOR VALUES IN ('${name}');`);
}

export async function isDbExists(): Promise<boolean> {
      return  await sql
            .unsafe(`select 1+1 AS result`)
            .then(() => {
                  return true;
            })
            .catch((error: Error) => {
                  console.error(error);
                  return false;
            });
}

export {executeSql} from "./executeSql"
export {executeSqlValues} from "./executeSqlValues"
export {createDB} from "./createDB"
export {createDetaultDatas} from "./createDetaultDatas"
export {createPgValues} from "./createPgValues"
export {createPgUpdates} from "./createPgUpdates"
export {createPgColumns} from "./createPgColumns"
export {createListColumns} from "./createListColumns"
export {createPgInsert} from "./createPgInsert"
export {createPgUpdate} from "./createPgUpdate"
export {writeDB} from "./writeDB"


