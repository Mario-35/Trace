/**
 * Create INSERT statement with postgresSql syntax
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createPgColumns, createPgValues, getColumns } from "."

export function createPgInsert(tableName: string, values: any) {
  return `INSERT INTO ${tableName} (${createPgColumns(tableName, values)}) VALUES (${createPgValues(tableName, values)})`
}
