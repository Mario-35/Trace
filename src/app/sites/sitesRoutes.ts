    // ########################################################
    // #                      PASSEPORTS                      #
    // ########################################################

import { Router } from "express"
import { deleteId, readAll, readAlSearch, readId, verifyBody } from "../../controller";
import { addSite, updateSite } from "./controller";
import { executeSql, executeSqlValues } from "../../db";

export const sitesRoutes = Router();

    // Get all sites
    sitesRoutes.get("/sites", async (req, res)  => {
      if(req.query.search)
        return await readAlSearch("sites", String(req.query.search)).then((site: any) => {
      return res.status(200).json(site);
    }).catch (error => {
      return res.status(404).json({"error": error.detail});
    });  else return await readAll("sites").then((site: any) => {
      return res.status(200).json(site);
    }).catch (error => {
      return res.status(404).json({"error": error.detail});
    });
  });
    

    // Get one site
    sitesRoutes.get("/site/:id", async (req, res)  => {
      return await readId("sites",  +req.params.id).then((site: any) => {
        return site.length > 0 
        ? res.status(200).json(site[0])
        : res.status(404).json({"code":404,"error":"Not Found"});
      }).catch (error => {
        return res.status(404).json({"error": error.detail});
      });
    });  

    sitesRoutes.get("/sites/search/:name", async (req, res)  => {
      return await executeSqlValues(`SELECT nom FROM sites WHERE UPPER(nom) LIKE '%${req.params.name.toUpperCase()}%'`).then((sites: any) => {
        return sites.length > 0 
        ? res.status(200).json(sites)
        : res.status(404).json({"code":404,"error":"Not Found"});
      }).catch (error => {
        return res.status(404).json({"error": error.detail});
      });
    });  

    // Create one site
    sitesRoutes.post("/site", async (req, res)  => {
      const values = verifyBody(req.body);
      if(values) {
        return await addSite(values).then((site: any) => {
          return res.status(201).json(site[0]);
        }).catch (error => {
          console.log(error);
          return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
        });
      } else res.status(400).json({"code" : 400, "error" : "Bad Request"});
    });

    // Update one site
    sitesRoutes.patch("/site/:id", async (req, res)  => {
      return await updateSite(req.body,  +req.params.id).then((site: any) => {
        return res.status(201).json(site);
      }).catch (error => {
        return res.status(404).json({"error": error.detail});
      });
    });

    // delete one site
    sitesRoutes.delete("/site/:id", async (req, res)  => {
      return await deleteId("sites",  +req.params.id).then((nothing: any) => {
        return res.status(203).json();
      }).catch (error => {
        return res.status(404).json({"error": error.detail});
      });
    });