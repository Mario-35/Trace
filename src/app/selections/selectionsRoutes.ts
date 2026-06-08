/**
 * Selections routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { deleteId, readId, readIds } from "../../controller";
import { executeSql } from "../../db";
import { dataBase } from "../../db/base";

export const selectionsRoutes = Router();

// Get selection
selectionsRoutes.get("/" + dataBase.selections.singular +"/:id", async (req, res) => {
  return await readId(dataBase.selections.name,  +req.params.id).then(async (selection: any) => {
    return await readIds(dataBase.echantillons.name, selection[0].ids).then(async (all: any) => {
      return res.status(200).json(all);
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});

// Create one selection
selectionsRoutes.post("/" + dataBase.selections.singular, async (req, res) => {
  return await executeSql(`INSERT INTO ${dataBase.selections.name} (ids) VALUES ('{${req.body.ids}}') RETURNING id`)
  .then((selection: any) => {
    return res.status(201).json(selection);
  }).catch (error => {
    console.error(error);
    return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
  });
})

// delete one selection
selectionsRoutes.delete("/" + dataBase.selections.singular + "/:id", async (req, res)  => {
  return await deleteId(dataBase.selections.name,  +req.params.id)
  .then(() => {
    return res.status(203).json();
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});
