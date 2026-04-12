/**
 * Configuration routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { readConfig, saveConfig } from "./controller";

export const configRoutes = Router();

// Get configuration
configRoutes.get("/configuration", async (req, res) => {
    return await readConfig()
    .then((config: any) => {
        return config.length > 0 
            ? res.status(200).json(config[0])
            : res.status(404).json({"code":404,"error":"Not Found"});
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });    
})

// Create one configuration
configRoutes.post("/configuration", async (req, res) => {
    return await saveConfig(req.body)
    .then((config: any) => {
        return res.status(201).json(config);
    }).catch (error => {
        return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
    });
})

// Update one configuration
configRoutes.patch("/configuration", async (req, res) => {
    return await saveConfig(req.body)
    .then((config: any) => {
        return res.status(201).json(config);
    }).catch((error: any) => {
         return res.status(404).json({"error": error.detail});
    });
});
