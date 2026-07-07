/**
 * Download file tool
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import fs from "fs"
import path from "path"

// no type declarations available for adm-zip
const AdmZip = require("adm-zip")

export function download() {
  const importDir = path.resolve(__dirname, "../import")
  const files = fs.readdirSync(importDir)

  const zip = new AdmZip()
  for (const file of files) {
    zip.addLocalFile(path.join(importDir, file))
  }

  return zip.toBuffer()
}
