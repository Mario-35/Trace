/**
 * Selection controller
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { executeSql } from "../../db"
import { dataBase } from "../../db/base"

// add a selection
export async function addSelection(values: any) {
  return await executeSql(
    `INSERT INTO ${dataBase.selections.name} (ids) VALUES ('{${values}}') RETURNING id`
  )
}
