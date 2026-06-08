/**
 * Excels routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { deleteId, readId } from "../../controller";
import { executeSql } from "../../db";
import { escapeSimpleQuotes } from "../../helpers/escapeSimpleQuotes";
import { dataBase } from "../../db/base";


export const excelsRoutes = Router();

excelsRoutes.get("/" + dataBase.excels.singular + "/:id", async (req, res) => {
    return await readId(dataBase.excels.name,  +req.params.id)
    .then((excel: any) => {
        return excel.length > 0 
            ? res.status(200).json(excel[0].datas)
            : res.status(404).json({"code":404,"message":"Not Found"});
    }).catch (error => {
        console.error(error);
        return res.status(404).json({"error": error.detail});
    });
})

excelsRoutes.post("/" + dataBase.excels.singular, async (req, res) => {
    return await executeSql(`INSERT INTO ${dataBase.excels.name} (datas) VALUES ('${escapeSimpleQuotes(JSON.stringify(req.body))}') RETURNING id`)
    .then((excel: any) => {
        return res.status(201).json(excel);
    }).catch (error => {
        console.error(error);
        return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
    });
})

// delete one sample
excelsRoutes.delete("/" + dataBase.excels.singular + "/:id", async (req, res) => {
    return await deleteId(dataBase.excels.name,  +req.params.id)
    .then(() => {
        return res.status(203).json();
    }).catch (error => {
        return res.status(404).json({"error": error.detail});
    });
});