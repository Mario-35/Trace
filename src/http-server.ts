import express, { Request, Response, Express } from "express";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import compression from "compression";
import path from "path";
import { logger } from "@infra/logger";
import {  HELMET } from "./constant";
import { createDB, sql, writeDB } from "./db";;
import { echantillonsRoutes, excelsRoutes, pagesRoutes, passeportsRoutes, selectionsRoutes, sitesRoutes, rpgsRoutes, campagnesRoutes, evenementsRoutes } from "./app";
import { configRoutes } from "@app/configuration/configRoutes";

export default class HttpServer {
  private app: Express;
  
  storage: multer.StorageEngine;
  upload: multer.Multer;
  _datas: any;

  constructor(app: express.Express) {
    this.app = app;
    this.storage = multer.memoryStorage();
    this.upload = multer({ storage: this.storage }); 
  }

  async createApp(): Promise<Express> {
    this.loadMiddlewares();
    this.loadRoutes();
    return this.app;
  }

  async stop(): Promise<void> {
    logger.info("Arret..");
  }

  private loadMiddlewares(): void {
    this.app.use(cors());
    this.app.use(helmet(HELMET) );
    this.app.use(express.json({limit: '50mb'}));
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
  }
  
  private loadRoutes(): void {

    this.app.use('/', configRoutes);
    this.app.use('/', echantillonsRoutes);
    this.app.use('/', passeportsRoutes);
    this.app.use('/', sitesRoutes);
    this.app.use('/', pagesRoutes);
    this.app.use('/', excelsRoutes);
    this.app.use('/', selectionsRoutes);    
    this.app.use('/', campagnesRoutes);    
    this.app.use('/', evenementsRoutes);    
    this.app.use('/', rpgsRoutes);  
      
    this.app.get("/", async (_req: Request, res: Response) => {
      res.json({
        message: "Serveur actif...",
      })
    });
        // Get test
    this.app.get("/init/:password", async (_req: Request, res: Response) => {
      res.status(200).json(await createDB(_req.params["password" as keyof object]));
    })

    this.app.get("/export", async (_req: Request, res: Response) => {
      res.status(200).json(await writeDB());
    })

    this.app.get("/test", async (_req: Request, res: Response) => {
      const lines:string[] = [];
      let ech = 0;
      for (let step = 1; step < 43; step++) {
        const nbParcelle = String(step).padStart(2, '0');
        [ "Stabilitée", "Densités apparentes", "Composite 1", "Composite 2", "Composite 3", "Composite 4", "Feuille Blé", ].forEach((e : string) => {
          ech = ech + 1;
          const nbEch = String(ech).padStart(2, '0');
          lines.push(` { "type": "Sol", "programme": "Thése Michael Briere", "pedagogique": false, "condition": null, "site": "Parcelle F0${nbParcelle}", "responsable": "S. Menasseri", "identification": "19032026114400${nbEch}", "parent": null, "dossier": "440", "libre": null, "creation": "2026-03-19T10:44:30.668", "prelevement": "2026-04-07", "peremption": "2031-04-07", "pays": "France", "region": "Bretagne", "latitude": "48.03169", "longitude": "-1.53286", "passeport": null, "cultures": {}, "stockage": {}, "etiquette": { "sticker0": { "key": "identification", "size": "12px", "align": "center" }, "sticker1": { "key": "programme", "size": "12px", "align": "center" }, "sticker2": { "key": "dossier-numero", "size": "14px", "align": "center" }, "sticker3": { "key": "responsable", "size": "12px", "align": "center" }, "sticker4": { "key": "pays", "size": "12px", "align": "center" }, "sticker5": { "key": "analyses", "size": "12px", "align": "center" } }, "analyses": [ "${e}" ], "etat": "Créer" }, `);
        })
      }
      console.log(lines.join("\r\n"));
      res.status(200).json({});
    })

    // ########################################################
    // #                        FILES                         #
    // ########################################################

    // Route to upload an image
    this.app.post('/upload', this.upload.single('image'), async (_req: Request, res: Response) => {
      if(_req.file)
        try {
            const imageBuffer = _req.file.buffer;
            const filename = _req.file.originalname;
            const result = await sql.unsafe('INSERT INTO fichiers (fichier, nom) VALUES ($1, $2) RETURNING id',
                [imageBuffer, filename]
            );
            res.json(result[0]);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error uploading file');
        }
    });

    this.app.get("/download/:id", async (_req: Request, res: Response) => {
      return await await sql.unsafe(`SELECT fichier FROM fichiers WHERE id = ${ +_req.params.id }`).then((fichier: any) => {
        return res.status(200).json(fichier);
      }).catch (error => {
        return res.status(404).json({"error": error.detail});
      });
    })
    
    // return the status server
    this.app.get("/status", async (_req: Request, res: Response) => {
      res.status(200).json({
        status: "Serveur actif",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      })
    })

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: {
          code: "ENDPOINT_NOT_FOUND",
          message: "Endpoint not found",
          path: req.originalUrl,
        }
      })
    })
  }

}

