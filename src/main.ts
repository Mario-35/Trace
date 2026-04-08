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


async function main(port: number) {
  try {
    const server = express();
    server.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});
    const httpServer = new HttpServer(server);
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
    
    const app = await httpServer.createApp();

    http.createServer(app).listen(3000, () => {
      logger.info(`Serveur HTTP actif sur le port ${3000}`);
    });
    
    https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'keys/server.key'), 'utf8'),
      cert: fs.readFileSync(path.join(__dirname, 'keys/server.crt'), 'utf8'),
      ca: fs.readFileSync(path.join(__dirname, 'keys/server.ca'), 'utf8')
    }, app).listen(443, () => {
      logger.info(`Serveur HTTPS actif sur le port ${443}`);
    });
  } catch (error) {
    logger.error(`Arret du serveur avec l'erreur : ${error}`);
    process.exit(ExitStatus.Failure);
  }

};

main(3000);
  