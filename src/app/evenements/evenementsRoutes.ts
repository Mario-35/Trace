/**
 * Evenements routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { deleteId, readAll, readAlSearch, readId, verifyBody } from "../../controller";
import { addEvenement, updateEvenement } from "./controller";
import { createListColumns, executeSql } from "../../db";
import { dataBase } from "../../db/base";

export const evenementsRoutes = Router();

evenementsRoutes.get("/list/" + dataBase.evenements.name, async (req, res)  => {
    await executeSql(`SELECT id, ${createListColumns(dataBase.evenements.name)} FROM ${dataBase.evenements.name} ORDER BY date`)
    .then((site: any) => {
      return res.status(200).json(site);
    }).catch (error => {
      return res.status(404).json({"error": error.detail});
    });
});

// Get all evenements
evenementsRoutes.get("/" + dataBase.evenements.name, async (req, res)  => {
  if(req.query.search)
    return await readAlSearch(dataBase.evenements.name, String(req.query.search))
    .then((site: any) => {
      return res.status(200).json(site);
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });  
  else return await readAll(dataBase.evenements.name)
  .then((site: any) => {
    return res.status(200).json(site);
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});
    
// Get one evenement
evenementsRoutes.get("/" + dataBase.evenements.singular + "/:id", async (req, res)  => {
  return await readId(dataBase.evenements.name,  +req.params.id)
  .then((site: any) => {
    return site.length > 0 
    ? res.status(200).json(site[0])
    : res.status(404).json({"code":404,"error":"Not Found"});
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});  
    
// Create one evenement
evenementsRoutes.post("/" + dataBase.evenements.singular + "", async (req, res)  => {
  const values = verifyBody(req.body);
  if(values) {
    return await addEvenement(values)
    .then((site: any) => {
      return res.status(201).json(site);
    }).catch (error => {
      console.error(error);
      return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
    });
  } else res.status(400).json({"code" : 400, "error" : "Bad Request"});
});


// Update one evenement
evenementsRoutes.patch("/" + dataBase.evenements.singular + "/:id", async (req, res)  => {
  return await updateEvenement(req.body,  +req.params.id)
  .then((site: any) => {
    return res.status(201).json(site);
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});

// delete one evenement
evenementsRoutes.delete("/" + dataBase.evenements.singular + "/:id", async (req, res)  => {
  return await deleteId(dataBase.evenements.name,  +req.params.id)
  .then(() => {
    return res.status(203).json();
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});