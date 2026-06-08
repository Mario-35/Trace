/**
 * Echantillons routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { deleteId, readId } from "../../controller"
import { createListColumns, createPgUpdates, executeSql, executeSqlValues, sql } from "../../db"
import { addEchantillon, updateEchantillon } from "./controller";
import { dataBase } from "../../db/base";

export const echantillonsRoutes = Router();

echantillonsRoutes.get("/list/" + dataBase.echantillons.name, async (req, res)  => {
    await executeSql(`SELECT id, ${createListColumns(dataBase.echantillons.name)} FROM ${dataBase.echantillons.name} ORDER BY creation`)
    .then((site: any) => {
      return res.status(200).json(site);
    }).catch (error => {
      return res.status(404).json({"error": error.detail});
    });
});

// Get one echantillon from identification
echantillonsRoutes.get("/" + dataBase.echantillons.singular + "/identification/:id", async (req, res) => {
    await executeSql(`SELECT id, ${createListColumns(dataBase.echantillons.name)} FROM ${dataBase.echantillons.name} WHERE identification ${req.params.id.length < 13 ? 'LIKE' : '='} '${ req.params.id }${req.params.id.length < 13 ? '%' : ''}' ORDER BY creation`)
    .then((echantillon: any) => {
        return res.status(200).json(echantillon);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Get all echantillons
echantillonsRoutes.get("/" + dataBase.echantillons.name, async (req, res) => {
    return await executeSql(`SELECT * FROM ${dataBase.echantillons.name} ORDER BY creation, Identification`)
    .then((echantillons: any) => {
        return res.status(200).json(echantillons);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Get all echantillons with passport id
echantillonsRoutes.get("/list/" + dataBase.echantillons.name +"/:id", async (req, res) => {
    await executeSql(`SELECT id, ${createListColumns(dataBase.echantillons.name)} FROM ${dataBase.echantillons.name} WHERE passeport = ${ +req.params.id } ORDER BY creation`)
    .then((echantillons: any) => {
        return res.status(200).json(echantillons);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Get one sample
echantillonsRoutes.get("/" + dataBase.echantillons.singular + "/:id", async (req, res) => {
    return await readId(dataBase.echantillons.name,  +req.params.id)
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
echantillonsRoutes.get("/" + dataBase.echantillons.singular + "/next/:id", async (req, res) => {
    return await executeSql(`SELECT COALESCE( MAX( SUBSTRING ( identification FROM 13 FOR 4 ):: int ), 0) as numero FROM ${dataBase.echantillons.name} WHERE identification LIKE '${String(req.params.id.slice(0,12))}%' LIMIT 1` )
    .then((max: any) => {
        return res.status(200).json(Number(max[0].max) + 1);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Get next sample number for after request
echantillonsRoutes.get("/" + dataBase.echantillons.singular + "/after/:id", async (req, res) => {
    return await executeSql(`SELECT MAX( SUBSTRING ( identification FROM 13 FOR 4 ):: int ) FROM ${dataBase.echantillons.name} WHERE identification like CONCAT( ( SELECT SUBSTRING ( identification FROM 1 FOR 12 ) FROM ${dataBase.echantillons.name} WHERE id = ${+String(req.params.id)} ), '%' )`)
    .then((max: any) => {
        return res.status(200).json(Number(max[0].max) + 1);
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});

// Create one sample
echantillonsRoutes.post("/" + dataBase.echantillons.singular + "", async (req, res) => {
    await addEchantillon(req.body)
    .then((echantillon: any) => {
        return res.status(201).json(echantillon);
    }).catch (error => {
        return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
    });
});

// Update one sample
echantillonsRoutes.patch("/" + dataBase.echantillons.singular + "/:id", async (req, res) => {
   await updateEchantillon(req.body, +req.params.id)
   .then((echantillon: any) => {
       return res.status(201).json(echantillon);
   }).catch((error: any) => {
        return res.status(404).json({"error": error.detail});
   })
}); 

// Update Selection
echantillonsRoutes.patch("/" + dataBase.echantillons.name + "/selection/:id", async (req, res) => {
    return await executeSql(`SELECT ids FROM selections WHERE id=${+req.params.id}`)
    .then(async (ids: any) => {
        return  await executeSql(`UPDATE ${dataBase.echantillons.name} SET ${createPgUpdates(dataBase.echantillons.name, req.body)} WHERE id IN (${ ids[0].ids })`)
        .then(() => {
            return res.status(201).json({selection : +req.params.id});
        }).catch((error: any) => {
                return res.status(404).json({"error": error.detail});
        });                                                                                                                                                                                                                                                                                                       
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    }); 
}); 

// delete one sample
echantillonsRoutes.delete("/" + dataBase.echantillons.singular + "/:id", async (req, res) => {
    return await deleteId(dataBase.echantillons.name,  +req.params.id)
    .then(() => {
        return res.status(203).json();
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});
