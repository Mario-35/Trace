/**
 * Excel controller
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { executeSql } from "../../db"
import { dataBase } from "../../db/base"
import { escapeSimpleQuotes } from "../../helpers/escapeSimpleQuotes"

// add excels import datas
export async function addExcel(values: any) {
  return await executeSql(
    `INSERT INTO ${dataBase.excels.name} (datas) VALUES ('${escapeSimpleQuotes(JSON.stringify(values))}') RETURNING id`
  )
}
