import { sql } from ".";


const executeSqlOneValues = async (query: string): Promise<object> => {
    return new Promise(async function (resolve, reject) {
        await sql
            .unsafe(query)
            .values()
            .then((res: object) => {
                resolve(res);
            })
            .catch((error: Error) => {
                console.log(error);
                reject(error);
            });
    });
};

const executeSqlMultiValues = async (queries: string[]): Promise<object> => {

    return new Promise(async function (resolve, reject) {
        await sql
            .begin((sql) =>
                queries.map(async (query: string) => {
                    await sql.unsafe(query).values();
                })
            )
            .then((res: object) => {
                resolve(res);
            })
            .catch((error: Error) => {
                console.log(error);
                reject(error);
            });
    });
};
export const executeSqlValues = async (query: string | string[]): Promise<object> =>
    typeof query === "string" ? executeSqlOneValues(query) : executeSqlMultiValues(query);
