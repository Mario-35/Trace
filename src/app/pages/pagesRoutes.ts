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
import { dataBase } from "../../db/base";
import { update } from "../../helpers/update";

export const pagesRoutes = Router();

// Get all echantillons
pagesRoutes.get("/index", async (req, res) => {
    const html = new Index();
    res.send(html.toString())
});

// add sample
pagesRoutes.get("/" + dataBase.echantillons.singular + "-add.html", async (req, res) => {
    const html = new Add(dataBase.echantillons.singular, _CONFIG);
    res.send(html.toString());
});

// add event
pagesRoutes.get("/" + dataBase.evenements.singular + "-add.html", async (req, res) => {
    const html = new Add(dataBase.evenements.singular, _CONFIG);
    res.send(html.toString());
});

// add site
pagesRoutes.get("/" + dataBase.sites.singular + "-add.html", async (req, res) => {
    const html = new Add(dataBase.sites.singular, _CONFIG);
    res.send(html.toString());
});

// add passeport
pagesRoutes.get("/" + dataBase.passeports.singular + "-add.html", async (req, res) => {
    const html = new Add(dataBase.passeports.singular, _CONFIG);
    res.send(html.toString());
});

// sites page
pagesRoutes.get("/" + dataBase.sites.name + ".html", async (req, res) => {
    const html = new List(dataBase.sites.name);
    res.send(html.toString())
});

// evenements page
pagesRoutes.get("/" + dataBase.evenements.name + ".html", async (req, res) => {
    const html = new List(dataBase.evenements.name);
    res.send(html.toString())
});

// passeports page
pagesRoutes.get("/" + dataBase.passeports.name + ".html", async (req, res) => {
    const html = new List(dataBase.passeports.name);
    res.send(html.toString())
});

// campagnes page
pagesRoutes.get("/" + dataBase.campagnes.name + ".html", async (req, res) => {
    const html = new List(dataBase.campagnes.name);
    res.send(html.toString())
});

// echantillons page
pagesRoutes.get("/" + dataBase.echantillons.name + ".html", async (req, res) => {
    const html = new List(dataBase.echantillons.name);
    res.send(html.toString())
});

// print sample sticker
pagesRoutes.get("/update", async (req, res) => {
    await update();    
    res.status(201).send({"update": "ok"});   
});

// print sample sticker
pagesRoutes.get("/new", async (req, res) => {
    res.status(201).send({"new": "ok"});   
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
        case dataBase.echantillons.singular:
            return await readId(dataBase.echantillons.name,  +req.params.id).then((echantillon: any) => {
                const html = new Print("echantillon", echantillon);
                res.set('Content-Type', 'text/html').send(html.toString())
            }).catch (error => {
                console.error(error);
                return res.status(404).json({"error": error.detail});
            });  
        case dataBase.selections.singular:
            return await readId(dataBase.selections.name,  +req.params.id).then(async (selection: any) => {
                return await readIds(dataBase.echantillons.name, selection[0].ids).then(async (all: any) => {
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
        case dataBase.passeports.singular:
            return await readId(dataBase.passeports.name,  +req.params.id).then((passeport: any) => {
                const html = new Print("passeport", passeport);
                res.set('Content-Type', 'text/html').send(html.toString())
            }).catch (error => {
                console.error(error);
                return res.status(404).json({"error": error.detail});
            });               
        case 'identification':   
            return await executeSql(`SELECT * FROM ${dataBase.echantillons.name} WHERE identification LIKE '${req.params.id.slice(0,12)}%'`).then(async (all: any) => {
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
    res.send(new Configuration().toString())
});

