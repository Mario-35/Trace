import { getColumns } from ".";
import { dataBase } from "./base";

export function createListColumns(tableName: string) {
      return getColumns(tableName)
            .filter(column => dataBase[tableName].columns[column].list === true)
            .map(
                  column => dataBase[tableName].columns[column].calculate  
                  ? `${dataBase[tableName].columns[column].calculate} AS ${column}` 
                  : `"${column}"`)
            .filter(e => e !== "")
            .join();
}

