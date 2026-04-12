/**
 * HTML Views First for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../constant";
import { dataBase } from "../../db/base";
import { CoreHtmlView } from "./core";
import fs from "fs";
import path from "path";

/**
 * Query Class for HTML View
 */

export class Configuration extends CoreHtmlView {
    constructor() {
        super();
        this.createConfigurationHtmlString();
    }
    
    createConfigurationHtmlString() {
        // Split files for better search and replace
        this._HTMLResult = fs
            .readFileSync(path.resolve(__dirname, "../../public/", "addConfiguration.html"))
            .toString()
            .split(EConstant.newline)
            .map((e: string) => e.trim())
            .filter((e) => e.trim() != "");
            
        this.replacer('"@DATAS@"', `
            const excelColumns = ["${Object.keys(dataBase.echantillons.columns).filter(e => dataBase.echantillons.columns[e].excel).join('","')}"];
            const stickerElements = {${Object.keys(dataBase.echantillons.columns).filter(e => dataBase.echantillons.columns[e].etiquette).map(e => `"${e}" : "${dataBase.echantillons.columns[e].etiquette}"`)}};
            `);
            
        this.replaceFile("css/form/configuration.css");
        this.replaceFile("css/form/main.css");
        this.replaceFile("css/main.css");
        this.replaceFile("css/editingList.css");
        this.replaceFile("css/splitter.css");
        this.replaceFile("css/modal.css");

// LOAD or file 
        this.replaceFile("js/configuration.js"); 
        this.replaceFile("js/constants.js"); 
        this.replaceFile("js/all.js"); 
        this.replaceFile("js/common/splitter.js"); 
        this.replaceFile("js/common/menu.js"); 
        this.replaceFile("js/common/editingList.js"); 
        this.replaceFile("js/form.js"); 
        this.replaceFile("js/api.js"); 
        this.replaceFile("js/helper.js"); 
        this.replaceFile("js/common/modal.js"); 
        this.replaceFile("js/libs/JsBarcode.all.min.js"); 
        this.replaceFile("js/api/print.js"); 
        this.replaceFile("js/configurations/add.js"); 
        this.replaceFile("js/common/regions.js"); 
        this.replaceFile("js/configurations/event.js");   
        this.replaceFile("js/stickers/controller.js"); 
        this.replaceFile("js/configurations/controller.js"); 
    }

    toString() {
        return super.toString();
    }
}
