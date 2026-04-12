/**
 * Campagnes routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { createListColumns, executeSql, sql } from "../../db";

export const campagnesRoutes = Router();

// Get all campagnes
campagnesRoutes.get("/list/campagnes", async (req, res)  => {
  return await executeSql(`WITH src AS (SELECT DISTINCT ON(SUBSTRING (identification FROM 1 FOR 12)) SUBSTRING (identification FROM 1 FOR 12) as id, type, dossier, creation, prelevement, programme, site, responsable FROM echantillons) SELECT src.id AS id, ${createListColumns("campagnes")} FROM src ORDER BY creation`)
  .then((site: any) => {
    return res.status(200).json(site);
  }).catch (error => {
    return res.status(404).json({"error": error.detail});
  });
});

// not sure is used
campagnesRoutes.get("/campagnes", async (req, res)  => {
  return await executeSql(`WITH src AS (SELECT DISTINCT(SUBSTRING (identification FROM 1 FOR 12)) AS id, type, dossier, creation, prelevement, programme, site, responsable FROM echantillons) SELECT *, (SELECT COUNT(*) FROM echantillons WHERE identification LIKE src.id || '%') AS echantillons FROM echantillons ORDER BY creation`)
  .then((site: any) => {
    return res.status(200).json(site);
  }).catch (error => {
    return res.status(404).json({"error": error.detail});
  });
});