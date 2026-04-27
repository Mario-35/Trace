/**
 * Passeports routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { deleteId, readAll, readAlSearch, readId, verifyBody } from "../../controller";
import { addPasseport, updatePasseport } from "./controller";
import { executeSql } from "../../db";
import { dataBase } from "../../db/base";

export const passeportsRoutes = Router();

// Get all passeports
passeportsRoutes.get("/" + dataBase.passeports.name, async (req, res)  => {
  if(req.query.search)
      return await readAlSearch(dataBase.passeports.name, String(req.query.search))
    .then((passeport: any) => {
      return res.status(200).json(passeport);
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });  
  else return await readAll(dataBase.passeports.name)
    .then((passeport: any) => {
      return res.status(200).json(passeport);
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });
});
    
// Get one passeport
passeportsRoutes.get("/" + dataBase.passeports.singular + "/:id", async (req, res)  => {
  return await readId(dataBase.passeports.name,  +req.params.id)
  .then((passeport: any) => {
    return passeport.length > 0 
    ? res.status(200).json(passeport[0])
    : res.status(404).json({"code":404,"error":"Not Found"});
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});    
    
// Get one passeport from site and year
passeportsRoutes.get("/" + dataBase.passeports.singular + "/:tracabilite/:year", async (req, res)  => {
  if (isNaN(+req.params.tracabilite)) {
    return await executeSql(`SELECT * FROM passeports WHERE UPPER(site) = '${String(req.params.tracabilite).toUpperCase()}' AND annee = '${req.params.year}'`)
    .then((passeport: any) => {
      return passeport.length === 1 
      ? res.status(200).json(passeport[0])
      : res.status(404).json({"code":404,"error":"Not Found"});
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });
  } else {
    return await executeSql(`SELECT * FROM passeports WHERE annee = '${req.params.year}' AND tracabilite = '${+req.params.tracabilite}'`).then((passeport: any) => {
      return passeport.length > 0 
      ? res.status(200).json(passeport[0])
      : res.status(404).json({"code":404,"error":"Not Found"});
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });
  }
});  

// Create one passeport
passeportsRoutes.post(dataBase.passeports.name, async (req, res)  => {
  const values = verifyBody(req.body);
  if(values) {
    return await addPasseport(values)
    .then((passeport: any) => {
      return res.status(201).json(passeport[0]);
    }).catch (error => {
      console.error(error);
      return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
    });
  } else res.status(400).json({"code" : 400, "error" : "Bad Request"});
});

// Update one passeport
passeportsRoutes.patch("/" + dataBase.passeports.singular + "/:id", async (req, res)  => {
  return await updatePasseport(req.body,  +req.params.id)
  .then((passeport: any) => {
    return res.status(201).json(passeport);
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});

// delete one passeport
passeportsRoutes.delete("/" + dataBase.passeports.singular + "/:id", async (req, res)  => {
  return await deleteId(dataBase.passeports.name,  +req.params.id)
  .then(() => {
    return res.status(203).json();
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});