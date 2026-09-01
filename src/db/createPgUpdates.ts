/**
 * Create UPDATE statement with postgresSql syntax
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { getColumns } from "."
import { escapeSimpleQuotes } from "../helpers/escapeSimpleQuotes"
import { dataBase } from "./base"

export function createPgUpdates(tableName: string, values: any) {
  const results: string[] = []
  const columns = getColumns(tableName)
  columns.forEach((column) => {
    if (values[column]) {      
      switch (dataBase[tableName].columns[column].type) {
        case "text":
          results.push(`"${column}" = '${escapeSimpleQuotes(values[column])}'`)
          break        
        case "text[]":
          results.push(`"${column}" = '{"${values[column].split(",").map((str: string) => escapeSimpleQuotes(str)).join('","')}"}'`)
          break
        case "json":
          results.push(`"${column}" = '${JSON.stringify(values[column])}'`)
          break
        default:
          results.push(`"${column}" = '${values[column]}'`)
      }
    }
  })
  return results.join()
}
