/**
 * Get all column List
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { getColumns } from ".";
import { dataBase } from "./base";

/**
 * 
 * @param tableName Name of database key table
 * @returns all coulum with list true
 */
export function getListColumns(tableName: string) {
      return getColumns(tableName)
            .filter(column => dataBase[tableName].columns[column].list === true)
            .map(
                  column => dataBase[tableName].columns[column].calculate  
                  ? `${dataBase[tableName].columns[column].calculate} AS ${column}` 
                  : `"${column}"`)
            .filter(e => e !== "")
            .join();
}

