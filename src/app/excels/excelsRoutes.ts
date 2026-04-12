/**
 * Excels routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { readId } from "../../controller";
import { executeSql } from "../../db";
import { escapeSimpleQuotes } from "../../helpers/escapeSimpleQuotes";


export const excelsRoutes = Router();

excelsRoutes.get("/excel/:id", async (req, res) => {
    return await readId("excels",  +req.params.id)
    .then((excel: any) => {
        return excel.length > 0 
            ? res.status(200).json(excel[0].datas)
            : res.status(404).json({"code":404,"message":"Not Found"});
    }).catch (error => {
        console.error(error);
        return res.status(404).json({"error": error.detail});
    });
})

excelsRoutes.post("/excel", async (req, res) => {
    return await executeSql(`INSERT INTO excels (datas) VALUES ('${escapeSimpleQuotes(JSON.stringify(req.body))}') RETURNING id`)
    .then((excel: any) => {
        return res.status(201).json(excel);
    }).catch (error => {
        console.error(error);
        return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
    });
})