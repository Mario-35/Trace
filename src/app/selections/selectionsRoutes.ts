import { Router } from "express"
import { readId, readIds } from "../../controller";
import { addSelection } from "./controller";


export const selectionsRoutes = Router();

    // Get selection
    selectionsRoutes.get("/selection/:id", async (req, res) => {
      return await readId("selections",  +req.params.id).then(async (selection: any) => {
        return await readIds("echantillons", selection[0].ids).then(async (all: any) => {
          return res.status(200).json(all);
        }).catch (error => {
          return res.status(404).json({"error": error.detail});
        });
      }).catch (error => {
        return res.status(404).json({"error": error.detail});
      });
    });
    
    // Create one selection
    selectionsRoutes.post("/selection", async (req, res) => {
      return await addSelection(req.body.ids).then((selection: any) => {
        return res.status(201).json(selection);
      }).catch (error => {
        return res.status(error.code === 23505 ? 409 : 404).json({"error": error.detail});
      });
    })