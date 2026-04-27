/**
 * Sites routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { deleteId, readAll, readAlSearch, readId, verifyBody } from "../../controller";
import { addSite, updateSite } from "./controller";
import { executeSql, executeSqlValues } from "../../db";
import { asyncForEach } from "../../helpers/asyncForEach";
import { dataBase } from "../../db/base";

export const sitesRoutes = Router();

// Get all sites
sitesRoutes.get("/sites", async (req, res)  => {
  if (req.query.search)
    return await readAlSearch(dataBase.sites.name, String(req.query.search))
    .then((site: any) => {
      return res.status(200).json(site);
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });
  else return await readAll(dataBase.sites.name)
    .then((site: any) => {
      return res.status(200).json(site);
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });
});
    
// Get one site
sitesRoutes.get("/" + dataBase.sites.singular + "/:id", async (req, res)  => {
  return await readId(dataBase.sites.name,  +req.params.id)
  .then((site: any) => {
    return site.length > 0 
      ? res.status(200).json(site[0])
      : res.status(404).json({"code":404,"error":"Not Found"});
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});  

// get site by name
sitesRoutes.get("/" + dataBase.sites.name + "/search/:name", async (req, res)  => {
  return await executeSql(`SELECT * FROM ${dataBase.sites.name} WHERE UPPER(nom) LIKE '%${String(req.params.name).toUpperCase()}%'`).then((sites: any) => {
    return sites.length > 0 
    ? res.status(200).json(sites)
    : res.status(404).json({"code":404,"error":"Not Found"});
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});  

// Create one site
sitesRoutes.post("/" + dataBase.sites.singular, async (req, res)  => {
  const values = verifyBody(req.body);
  if(values) {
    return await addSite(values)
    .then((site: any) => {
      return res.status(201).json(site);
    }).catch (error => {
      console.error(error);
      return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
    });
  } else res.status(400).json({"code" : 400, "error" : "Bad Request"});
});
    
// Get all search site for excel import list correspondance
sitesRoutes.post("/" + dataBase.sites.singular + "/rapprochement", async (req, res)  => {
  const result: Record<string, string> = {};
  await asyncForEach(req.body.unique, async (name: string) => {
    await executeSqlValues(`SELECT nom FROM ${dataBase.sites.name} WHERE UPPER(nom) LIKE '${name.toUpperCase()}%'`)
    .then((res: any) => {
      result[name] = res[0] ? String(res[0]) : "Non Trouvé";
    }).catch (error => {
      console.error(error);
      return res.status(404).json({"error": error.detail});
    });
  });
  return res.status(201).json(result);
});

// Update one site
sitesRoutes.patch("/" + dataBase.sites.singular + "/:id", async (req, res)  => {
  return await updateSite(req.body,  +req.params.id)
  .then((site: any) => {
    return res.status(201).json(site);
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});

// delete one site
sitesRoutes.delete("/" + dataBase.sites.singular + "/:id", async (req, res)  => {
  return await deleteId(dataBase.sites.name,  +req.params.id)
  .then(() => {
    return res.status(203).json();
  }).catch (error => {
    console.error(error);
    return res.status(404).json({"error": error.detail});
  });
});

// for datalists but not used
sitesRoutes.get("/" + dataBase.sites.name + "/filter/:name", async (req, res)  => {
  return await executeSqlValues(`SELECT nom FROM ${dataBase.sites.name} WHERE UPPER(nom) LIKE '${String(req.params.name).toUpperCase()}%'`).then((sites: any) => {
    return res.status(201).json(sites.map((e: any) => e[0]));
  });
});