/**
 * executeSql
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { sql } from ".";

const executeSqlOne = async (query: string): Promise<object> => {
    console.log(query);
    return new Promise(async function (resolve, reject) {
        await sql
            .unsafe(query)
            .then((res: object) => {
                resolve(res);
            })
            .catch((error: Error) => {
                console.error(error);
                reject(error);
            });
    });
};

const executeSqlMulti = async (queries: string[]): Promise<object> => {
    return new Promise(async function (resolve, reject) {
        await sql
            .begin((sql) =>
                queries.map(async (query: string) => {
                    await sql.unsafe(query);
                })
            )
            .then((res: object) => {
                resolve(res);
            })
            .catch((error: Error) => {
                console.error(error);
                reject(error);
            });
    });
};

export const executeSql = async (query: string | string[]): Promise<object> => (typeof query === "string" ? executeSqlOne(query) : executeSqlMulti(query));
