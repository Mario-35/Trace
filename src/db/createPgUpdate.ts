/**
 * Create UPDATE table statement with postgresSql syntax
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createPgUpdates } from "."

export function createPgUpdate(tableName: string, values: any) {
  return `UPDATE ${tableName} SET ${createPgUpdates(tableName, values)}`
}
