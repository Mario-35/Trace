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
import { Export } from "../../html/class/export";
import { Documentation } from "../../html/class/documentation";
import { download } from "../../helpers/download";
import { clean } from "../../helpers/clean";

export const pagesRoutes = Router();

// Get all echantillons
pagesRoutes.get("/index", async (req, res) => {
    const html = new Index();
    res.send(html.toString())
});

// add sample
pagesRoutes.get("/documentation/:page", async (req, res) => {
    const html = new Documentation(req.params.page + ".html");
    res.send(html.toString());
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
    const html = new List(dataBase.echantillons.name, true);
    res.send(html.toString())
});

// echantillons page
pagesRoutes.get("/export.html", async (req, res) => {
    const id = req.url.split("?selection=")[1];
    await executeSql(`SELECT ids FROM selections WHERE id=${id}`)
    .then(async (ids: any) => {
        await executeSql(`SELECT 
            ${Object.keys(dataBase.echantillons.columns).filter(e => dataBase.echantillons.columns[e].type !== "json" && !dataBase.echantillons.columns[e].calculate)}, 
            unnest(analyses) AS analyses 
            FROM ${dataBase.echantillons.name} WHERE id IN (${ ids[0].ids })`)
        .then((datas) => {
            const html = new Export(datas);            
            res.send(html.toString())
        });                                                                                                                                                                                                                                                                                                     
    });
});

// print sample sticker
pagesRoutes.get("/update", async (req, res) => {
    await update(); 
    res.redirect('/');
    process.exit(0);

});

pagesRoutes.get("/clean", async (req, res) => {
    await clean(); 
    res.status(201).send();

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
    const conf = await readId(dataBase.configuration.name, 1)
    .then((configuration: any) => {
            res.send(new Configuration(configuration[0]).toString())
    }).catch (error => {
            console.error(error);
    });       
});

pagesRoutes.get("/download", async (req, res) => {
    const data = download(res); 
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=downloaded_file.zip`);
    res.set('Content-Length', data.length);
    res.send(data);

});