import express from "express";
import { logger } from "@infra/logger";
import HttpServer from "./http-server";
import fs from "fs";
import path from "path";
import { writeConfig } from "@app/configuration/controller";
import { isDbExists } from "./db";
import https from "https";
import http from "http";


enum ExitStatus {
  Failure = 1,
  Success = 0,
}

async function mainHttp(port: number) {
  try {
    const httpServer = new HttpServer(express());
    await exits(httpServer);   

    const app = await httpServer.createApp();
    // app.listen(port, () => logger.info(`Serveur HTTP actif sur le port ${port}`));
    http.createServer(app).listen(port, () => {
      logger.info(`Serveur HTTP actif sur le port ${port}`);
    });
  } catch (error) {
    logger.error(`Arret du serveur avec l'erreur : ${error}`);
    process.exit(ExitStatus.Failure);
  }
};


async function exits(httpServer: HttpServer) {
  const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
  
  if (!fs.existsSync(path.resolve(__dirname, "./public/js", "configuration.js")) && await isDbExists() === true) writeConfig(); 
  exitSignals.map((sig) =>
    process.on(sig, async () => {
      try {
        httpServer.stop();
        logger.info("Arret du serveur OK");
        process.exit(ExitStatus.Success);
      } catch (error) {
        logger.error(`Arret du serveur avec l'erreur : ${error}`);
        process.exit(ExitStatus.Failure);
      }
    })
  );
}

async function mainHttps(port: number) {
  try {
    const httpServer = new HttpServer(express());
    await exits(httpServer);   
    
    const options = {
      key: fs.readFileSync(path.join(__dirname, 'keys/server.key')),
      cert: fs.readFileSync(path.join(__dirname, 'keys/server.crt'))
    };
    
    const app = await httpServer.createApp();
    
    https.createServer(options, app).listen(port, () => {
      logger.info(`Serveur HTTPS actif sur le port ${port}`);
    });
  } catch (error) {
    logger.error(`Arret du serveur avec l'erreur : ${error}`);
    process.exit(ExitStatus.Failure);
  }

};

if (process.env.NODE_ENV === 'production') 
  mainHttps(443);
else 
  mainHttp(3000);
  