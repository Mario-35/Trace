import { createPgUpdate, createPgValues, executeSql, getColumns, sql } from "../../db";
import path from "path";
import util from "util";
import fs from "fs";
import { dataBase } from "../../db/base";

export async function readConfig() {
      return await sql`SELECT * FROM configuration WHERE id = 1`
};

export function createConfig(configuration?: any) {
      configuration = configuration ||  {};
      configuration["excelColumns"] = Object.keys(dataBase.echantillons.columns).filter(e => dataBase.echantillons.columns[e].excel);
      configuration["stickerElements"] = JSON.parse(`{"echantillon": "1902202617320002", "dossier":"0429", "numero":"0002", "prelevement":"2026-03-04", "peremption":"2031-03-04", "passeport":"2026-0003", "dossier-numero":"0429-0002", ${Object.keys(dataBase.echantillons.columns).filter(e => dataBase.echantillons.columns[e].etiquette).map(e => `"${e}" : "${dataBase.echantillons.columns[e].etiquette}"`)}}`);
      return configuration;
}


export function writeConfigurationFile(configuration: any) {
      configuration["excelColumns"] = Object.keys(dataBase.echantillons.columns).filter(e => dataBase.echantillons.columns[e].excel);
      configuration["stickerElements"] = JSON.parse(`{"echantillon": "1902202617320002", "dossier":"0429",
"numero":"0002",
"prelevement":"2026-03-04",
"peremption":"2031-03-04",
"passeport":"2026-0003",
"dossier-numero":"0429-0002", ${Object.keys(dataBase.echantillons.columns).filter(e => dataBase.echantillons.columns[e].etiquette).map(e => `"${e}" : "${dataBase.echantillons.columns[e].etiquette}"`)}}`);

      fs.writeFile(
            path.resolve(__dirname, "../../public/js/", "configuration.js"),
            `_CONFIGURATION = ${util.inspect(configuration, { showHidden: false, depth: null, colors: false }) }`,
            (error) => {
                  console.log(`Ecriture de la configuration : ${error || "Ok"}`);                
            }
      );
}




export async function writeConfig() {
      executeSql(`SELECT * FROM configuration WHERE id = 1`).then((configuration: any) => {
            writeConfigurationFile(configuration[0]);
      });
}

export async function saveConfig(values: any) {
      return new Promise(async function (resolve, reject) {
            return await executeSql(`${createPgUpdate("configuration", values)} WHERE id = 1`)
            .then(async (ret) => {
                  await writeConfig();
                  resolve(ret);
            }).catch (error => {
                  reject(error);
            });
      });
};
