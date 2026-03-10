import { getColumns } from ".";
import { escapeSimpleQuotes } from "../helpers/escapeSimpleQuotes";
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
                        default:
                              results.push(escapeSimpleQuotes(values[column]));
                  }
            }
      })
      return `'${results.join("','")}'`;
}