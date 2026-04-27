/**
 * Campagnes routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { createListColumns, executeSql, sql } from "../../db";
import { removeReturns } from "../../helpers/removeReturns";
import { dataBase } from "../../db/base";

export const campagnesRoutes = Router();

// Get all campagnes
campagnesRoutes.get("/list/" + dataBase.campagnes.name, async (req, res)  => {
  return await executeSql(removeReturns(`WITH 
        src AS (
            SELECT 
            DISTINCT ON(
                SUBSTRING (
                COALESCE(parent, identification) FROM 1 FOR 12 )
            ) SUBSTRING (
                COALESCE(parent, identification) FROM 1 FOR 12
            ) as id, 
            type, 
            dossier, 
            creation, 
            prelevement, 
            programme, 
            site, 
            responsable 
            FROM 
            ${dataBase.echantillons.name}
        ) 
        SELECT 
            src.id AS id, 
            ${createListColumns(dataBase.campagnes.name) } 
        FROM 
            src 
        ORDER BY 
            creation`)
  ).then((site: any) => {
    return res.status(200).json(site);
  }).catch (error => {
    return res.status(404).json({"error": error.detail});
  });
});
