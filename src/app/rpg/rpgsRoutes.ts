/**
 * Rpg routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { getRpg } from "./controller";
import { executeSqlValues } from "../../db";
export const rpgsRoutes = Router();

// Get rpg
rpgsRoutes.get("/rpg", async (req, res)  => {
  const tmp = req.url.split("?pos=")[1].split(",");
  return await getRpg(tmp[0] ,tmp[1]).then(async (rpg: any) => {
    const codes = await executeSqlValues(`SELECT CONCAT('"', UPPER(code), '" : "',valeur, '"') FROM rpg WHERE UPPER(code) IN ('${Array.from(new Set(Object.values(rpg).map(item => item))).join("','")}')`);
    return res.status(200).json({
      values : rpg,
      codes : codes,
    });
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});