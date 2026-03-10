import { getColumns } from ".";
import { dataBase } from "./base";

export function createPgUpdates(tableName: string, values: any) {
      const results: string[] = [];
      const columns = getColumns(tableName);
      columns.forEach(column => {
            if (values[column]) {
                  switch (dataBase[tableName].columns[column].type) {
                        case "text[]":
                              results.push(`"${column}" = '{"${values[column].split(',').join('","')}"}'`);
                              break;  
                        case "json":
                              results.push(`"${column}" = '${JSON.stringify(values[column])}'`);
                              break;                                         
                        default:
                              results.push(`"${column}" = '${values[column]}'`);
                  }
            }
      });
      return results.join();
}