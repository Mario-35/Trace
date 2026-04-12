import { getColumns } from ".";
import { escapeSimpleQuotes } from "../helpers/escapeSimpleQuotes";
import { toTitleCase } from "../helpers/toTitleCase";
import { dataBase } from "./base";

export function createPgValues(tableName: string, values: any, columns?: string[]) {
      const results: string[] = [];
      (columns || getColumns(tableName)).forEach(column => {
            if (values[column] && values[column] !== "") {
                  switch (dataBase[tableName].columns[column].type) {
                        case "text[]":
                              (typeof values[column] === "string")
                                    ? results.push(`{"${values[column].split(',').join('","')}"}`)
                                    : results.push(`{"${values[column]}"}`);
                              break;  
                        case "json":
                              results.push(`${JSON.stringify(values[column])}`);
                              break;                                                
                        // case "text":
                        case "text":
                              results.push(escapeSimpleQuotes(toTitleCase(values[column])));
                              break;
                        //       if (dataBase[tableName].columns[column].create.includes('varchar')) {
                        //             const max = dataBase[tableName].columns[column].create.split('(')[1].split(')')[0];
                        //             results.push(escapeSimpleQuotes(values[column]).substring(0,+max));
                        //       } else results.push(escapeSimpleQuotes(values[column]));
                        //       break;                                                
                        default:
                              results.push(escapeSimpleQuotes(values[column]));
                  }
            }
      })
      return `'${results.join("','")}'`;
}