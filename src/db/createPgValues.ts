/**
 * Create list values with postgresSql syntax
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { getColumns } from "."
import { escapeSimpleQuotes } from "../helpers/escapeSimpleQuotes"
import { toTitleCase } from "../helpers/toTitleCase"
import { dataBase } from "./base"

// Create list values with postgresSql syntax
export function createPgValues(tableName: string, values: any, columns?: string[]) {
  const results: string[] = []
  ;(columns || getColumns(tableName)).forEach((column) => {
    if (values[column] && values[column] !== "") {
      switch (dataBase[tableName].columns[column].type) {
        case "text[]":
          typeof values[column] === "string"
            ? results.push(`{"${values[column].split(",").join('","')}"}`)
            : results.push(`{"${values[column]}"}`)
          break
        case "json":
          results.push(`${JSON.stringify(values[column])}`)
          break
        case "text":
          results.push(escapeSimpleQuotes(toTitleCase(values[column])))
          break
        default:
          results.push(escapeSimpleQuotes(values[column]))
      }
    }
  })
  return `'${results.join("','")}'`
}
