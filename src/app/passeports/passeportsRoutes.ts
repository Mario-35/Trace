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

export const passeportsRoutes = Router();

// Get all passeports
passeportsRoutes.get("/passeports", async (req, res)  => {
  if(req.query.search)
      return await readAlSearch("passeports", String(req.query.search))
    .then((passeport: any) => {
      return res.status(200).json(passeport);
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });  
  else return await readAll("passeports")
    .then((passeport: any) => {
      return res.status(200).json(passeport);
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });
});
    
// Get one passeport
passeportsRoutes.get("/passeport/:id", async (req, res)  => {
  return await readId("passeports",  +req.params.id)
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
passeportsRoutes.get("/passeport/:tracabilite/:year", async (req, res)  => {
  if (isNaN(+req.params.tracabilite)) {
    return await executeSql(`SELECT * FROM passeports WHERE UPPER(site) = '${req.params.tracabilite.toUpperCase()}' AND annee = '${req.params.year}'`)
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
passeportsRoutes.post("/passeport", async (req, res)  => {
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
passeportsRoutes.patch("/passeport/:id", async (req, res)  => {
  return await updatePasseport(req.body,  +req.params.id)
  .then((passeport: any) => {
    return res.status(201).json(passeport);
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});

// delete one passeport
passeportsRoutes.delete("/passeport/:id", async (req, res)  => {
  return await deleteId("passeports",  +req.params.id)
  .then(() => {
    return res.status(203).json();
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});