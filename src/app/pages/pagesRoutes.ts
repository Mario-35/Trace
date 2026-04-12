/**
 * Pages routes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Router } from "express"
import { Index } from "../../html/class/main";
import { Print } from "../../html/class/print";
import { readId, readIds } from "../../controller";
import { List } from "../../html/class/list";
import { Configuration } from "../../html/class/configuration";
import { executeSql } from "../../db";
import { Add } from "../../html/class/add";
import { _CONFIG, setConfig } from "../../constant";

export const pagesRoutes = Router();

// Get all echantillons
pagesRoutes.get("/index", async (req, res) => {
    const html = new Index();
    res.send(html.toString())
});

// add sample
pagesRoutes.get("/echantillon-add.html", async (req, res) => {
    const html = new Add("echantillon", _CONFIG);
    res.send(html.toString());
});

// add event
pagesRoutes.get("/evenement-add.html", async (req, res) => {
    const html = new Add("evenement", _CONFIG);
    res.send(html.toString());
});

// add site
pagesRoutes.get("/site-add.html", async (req, res) => {
    const html = new Add("site", _CONFIG);
    res.send(html.toString());
});

// selection page
pagesRoutes.get("/selections.html", async (req, res) => {
    const html = new List("Selection");
    res.send(html.toString())
});

// sites page
pagesRoutes.get("/sites.html", async (req, res) => {
    const html = new List("Site");
    res.send(html.toString())
});

// evenements page
pagesRoutes.get("/evenements.html", async (req, res) => {
    const html = new List("Evenement");
    res.send(html.toString())
});

// passeports page
pagesRoutes.get("/passeports.html", async (req, res) => {
    const html = new List("Passeport");
    res.send(html.toString())
});

// campagnes page
pagesRoutes.get("/campagnes.html", async (req, res) => {
    const html = new List("Campagne");
    res.send(html.toString())
});

// echantillons page
pagesRoutes.get("/echantillons.html", async (req, res) => {
    const html = new List("Echantillon", true);
    res.send(html.toString())
});

// print sample sticker
pagesRoutes.get("/print/:type", async (req, res) => {
    switch (req.params.type ) {
        case 'echantillon':
            const html = new Print("echantillon", [_CONFIG] );
            return res.set('Content-Type', 'text/html').send(html.toString());
    }
});

// prints
pagesRoutes.get("/print/:type/:id", async (req, res) => {
    switch (req.params.type ) {
        case 'config':
            if (_CONFIG) {
                const html = new Print("echantillon", _CONFIG);
                return res.set('Content-Type', 'text/html').send(html.toString());
            } else return res.status(404).json({"error": "no config"});
        case 'echantillon':
            return await readId("echantillons",  +req.params.id).then((echantillon: any) => {
                const html = new Print("echantillon", echantillon);
                res.set('Content-Type', 'text/html').send(html.toString())
            }).catch (error => {
                console.error(error);
                return res.status(404).json({"error": error.detail});
            });  
        case 'selection':
            return await readId("selections",  +req.params.id).then(async (selection: any) => {
                return await readIds("echantillons", selection[0].ids).then(async (all: any) => {
                        const html = new Print("echantillon", all);
                        res.set('Content-Type', 'text/html').send(html.toString())
                }).catch (error => {
                    console.error(error);
                    return res.status(404).json({"error": error.detail});
                });
            }).catch (error => {
                console.error(error);
                return res.status(404).json({"error": error.detail});
            });   
        case 'passeport':
            return await readId("passeports",  +req.params.id).then((passeport: any) => {
                const html = new Print("passeport", passeport);
                res.set('Content-Type', 'text/html').send(html.toString())
            }).catch (error => {
                console.error(error);
                return res.status(404).json({"error": error.detail});
            });               
        case 'identification':   
            return await executeSql(`SELECT * FROM echantillons WHERE identification LIKE '${req.params.id.slice(0,12)}%'`).then(async (all: any) => {
                    const html = new Print("echantillon", all);
                    res.set('Content-Type', 'text/html').send(html.toString())
            }).catch (error => {
                console.error(error);
                return res.status(404).json({"error": error.detail});
            }); 
        case 'echantillonPasseport':
            console.log("ici todo")

        default:
            break;
    };

});

pagesRoutes.post("/SaveConfig", async (req, res)  => {
    setConfig(req.body);
    res.status(201).send();
});

// configuration page
pagesRoutes.get("/configuration.html", async (req, res) => {
    const html = new Configuration();
    res.send(html.toString())
});

