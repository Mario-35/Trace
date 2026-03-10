import { Router } from "express"
import { Index } from "../../html/class/main";
import { Print } from "../../html/class/print";
import { readId, readIds } from "../../controller";
import { List } from "../../html/class/list";
import { Configuration } from "../../html/class/configuration";
import { executeSql } from "../../db";
import { Echantillon } from "../../html/class/echantillon";
import { Add } from "../../html/class/add";
import { readConfig } from "@app/configuration/controller";
export const pagesRoutes = Router();

let config: any | undefined = undefined;
// Get all echantillons
pagesRoutes.get("/index", async (req, res) => {
    const html = new Index();
    res.send(html.toString())
});

// add echanillion
pagesRoutes.get("/echantillon-add.html", async (req, res) => {
    readConfig().then(config => {
        const html = new Add("echantillon", config);
        res.send(html.toString());
    });
});

pagesRoutes.get("/site-add.html", async (req, res) => {
    readConfig().then(config => {
        const html = new Add("site", config);
        res.send(html.toString());
    });
});

pagesRoutes.get("/selections.html", async (req, res) => {
    const html = new List("Selection");
    res.send(html.toString())
});

pagesRoutes.get("/sites.html", async (req, res) => {
    const html = new List("Site");
    res.send(html.toString())
});

pagesRoutes.get("/passeports.html", async (req, res) => {
    const html = new List("Passeport");
    res.send(html.toString())
});

pagesRoutes.get("/echantillons.html", async (req, res) => {
    const html = new List("Echantillon", true);
    res.send(html.toString())
});

pagesRoutes.get("/print/:type", async (req, res) => {
        switch (req.params.type ) {
            case 'echantillon':
                const html = new Print("echantillon", [config] );
                return res.set('Content-Type', 'text/html').send(html.toString());
                // } else return res.status(404).json({"error": "no config"});
        }
});

pagesRoutes.get("/print/:type/:id", async (req, res) => {
    switch (req.params.type ) {
        case 'config':
            if (config) {
                const html = new Print("echantillon", config);
                return res.set('Content-Type', 'text/html').send(html.toString());
            } else return res.status(404).json({"error": "no config"});
        case 'echantillon':
            return await readId("echantillons",  +req.params.id).then((echantillon: any) => {
                const html = new Print("echantillon", echantillon);
                res.set('Content-Type', 'text/html').send(html.toString())
            }).catch (error => {
                return res.status(404).json({"error": error.detail});
            });  
        case 'selection':
            return await readId("selections",  +req.params.id).then(async (selection: any) => {
                return await readIds("echantillons", selection[0].ids).then(async (all: any) => {
                        const html = new Print("echantillon", all);
                        res.set('Content-Type', 'text/html').send(html.toString())
                }).catch (error => {
                return res.status(404).json({"error": error.detail});
                });
            }).catch (error => {
                return res.status(404).json({"error": error.detail});
            });   
        case 'passeport':
            return await readId("passeports",  +req.params.id).then((passeport: any) => {
                const html = new Print("passeport", passeport);
                res.set('Content-Type', 'text/html').send(html.toString())
            }).catch (error => {
                return res.status(404).json({"error": error.detail});
            });               
        case 'identification':   
            return await executeSql(`SELECT * FROM echantillons WHERE identification LIKE '${req.params.id.slice(0,12)}%'`).then(async (all: any) => {
                    const html = new Print("echantillon", all);
                    res.set('Content-Type', 'text/html').send(html.toString())
            }).catch (error => {
                return res.status(404).json({"error": error.detail});
            }); 
        case 'echantillonPasseport':
            console.log("ici todo")

        default:
            break;
    };

});

pagesRoutes.post("/SaveConfig", async (req, res)  => {
    config = req.body;
    res.status(201).send();
});

pagesRoutes.get("/configuration.html", async (req, res) => {
    const html = new Configuration();
    res.send(html.toString())
});

pagesRoutes.get("/add/echantillon.html", async (req, res) => {
        const html = new Echantillon();
    res.send(html.toString())
});
