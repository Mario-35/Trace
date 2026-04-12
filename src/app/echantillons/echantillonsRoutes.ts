/**
 * Echantillons routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { deleteId, readId } from "../../controller"
import { createListColumns, executeSql, executeSqlValues, sql } from "../../db"
import { addEchantillon, updateEchantillon } from "./controller";

export const echantillonsRoutes = Router();

echantillonsRoutes.get("/list/echantillons", async (req, res)  => {
    await executeSql(`SELECT id, ${createListColumns("echantillons")} FROM echantillons ORDER BY creation`)
    .then((site: any) => {
      return res.status(200).json(site);
    }).catch (error => {
      return res.status(404).json({"error": error.detail});
    });
});

// Get one echantillon from identification
echantillonsRoutes.get("/echantillon/identification/:id", async (req, res) => {
    await executeSql(`SELECT id, ${createListColumns("echantillons")} FROM echantillons WHERE identification ${req.params.id.length < 13 ? 'LIKE' : '='} '${ req.params.id }${req.params.id.length < 13 ? '%' : ''}' ORDER BY creation`)
    .then((echantillon: any) => {
        return res.status(200).json(echantillon);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Get all echantillons
echantillonsRoutes.get("/echantillons", async (req, res) => {
    return await executeSql(`SELECT * FROM echantillons ORDER BY creation, Identification`)
    .then((echantillons: any) => {
        return res.status(200).json(echantillons);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Get all echantillons with passport id
echantillonsRoutes.get("/list/echantillons/:id", async (req, res) => {
    await executeSql(`SELECT id, ${createListColumns("echantillons")} FROM echantillons WHERE passeport = ${ +req.params.id } ORDER BY creation`)
    .then((echantillons: any) => {
        return res.status(200).json(echantillons);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Get one sample
echantillonsRoutes.get("/echantillon/:id", async (req, res) => {
    return await readId("echantillons",  +req.params.id)
    .then(async (echantillon: any) => {
        if (echantillon.length === 1) {
            echantillon = echantillon[0];
            if (Object.keys(echantillon.cultures).length > 0) {
                echantillon.codes = await executeSqlValues(`SELECT CONCAT('"', UPPER(code), '" : "',valeur, '"') FROM rpg WHERE UPPER(code) IN ('${Array.from(new Set(Object.values(echantillon.cultures).map(item => item))).join("','")}')`);
            }
            return res.status(200).json(echantillon);
        } else return res.status(404).json({"error": "Not found"});
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Get next sample number
echantillonsRoutes.get("/echantillon/next/:id", async (req, res) => {
    return await executeSql(`SELECT MAX(SUBSTRING (identification FROM 13 FOR 4)::int) from echantillons where identification LIKE '${req.params.id.slice(0, 12)}%'`)
    .then((max: any) => {
        return res.status                                                                                                                                                                                                                                                                                                         (200).json(Number(max[0].max) + 1);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Get next sample number for after request
echantillonsRoutes.get("/echantillon/after/:id", async (req, res) => {
    return await executeSql(`select MAX(SUBSTRING (identification FROM 13 FOR 4)::int) from echantillons where identification like CONCAT((select SUBSTRING (identification FROM 1 FOR 12) from echantillons where id = ${+req.params.id}), '%')`)
    .then((max: any) => {
        return res.status(200).json(Number(max[0].max) + 1);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Create one sample
echantillonsRoutes.post("/echantillon", async (req, res) => {
    await addEchantillon(req.body)
    .then((echantillon: any) => {
        return res.status(201).json(echantillon);
    }).catch (error => {
        return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
    });
});

// Update one sample
echantillonsRoutes.patch("/echantillon/:id", async (req, res) => {
   await updateEchantillon(req.body,  +req.params.id)
   .then((echantillon: any) => {
       return res.status(201).json(echantillon);
   }).catch((error: any) => {
        return res.status(404).json({"error": error.detail});
   })
}); 

// delete one sample
echantillonsRoutes.delete("/echantillon/:id", async (req, res) => {
    return await deleteId("echantillons",  +req.params.id)
    .then(() => {
        return res.status(203).json();
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});
