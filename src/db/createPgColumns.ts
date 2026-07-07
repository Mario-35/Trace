/**
 * Create column list  with postgresSql syntax
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { getColumns } from "."

export function createPgColumns(tableName: string, values: any) {
  return getColumns(tableName)
    .map((column) => (values[column] ? `"${column}"` : ""))
    .filter((e) => e !== "")
    .join()
}
