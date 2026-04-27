/**
 * HTML Print for API.
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { CoreHtmlView } from "./core";

/**
 * Print Class for HTML View
 */

export class Print extends CoreHtmlView {
    datas: any;
    constructor(type: "echantillon" | "passeport", datas: any) {
        super();
        this.datas = datas;
        if (type === "echantillon") 
            this.createPrintEchantillonHtmlString();
        else if (type ===  "passeport") 
            this.createPrintPasseportHtmlString()
    }
    
    createPrintPasseportHtmlString() {
        this._HTMLResult = ['<!DOCTYPE html>',
                            '<html lang="en">',
                            '<head>',
                            '<meta charset="UTF-8">',
                            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                            '<title>Impression des passeports</title>',
                            this.getFile("./css/print.css"),
                            this.getFile("./css/passeport.css"),
                            '</head>',
                            '<body>',
                            '<div class="content" id="passeportsContent"></div>',
                            '</body> ',
                            `<script>`,
                            `_DATAPI = ${JSON.stringify(this.datas)}`,
                            '</script>',
                            this.getFile("./js/configuration.js"),
                            this.getFile("./js/constants.js"),
                            this.getFile("./js/api/print.js"),
                            `<script>start()</script>`,
                            '</html>'].map((e: string) => e.trim());
    }

    createPrintEchantillonHtmlString() {
        this._HTMLResult = ['<!DOCTYPE html>',
                            '<html lang="en">',
                            '<head>',
                            '<meta charset="UTF-8">',
                            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                            '<title>Gestion des étiquettes</title>',
                            this.getFile("./css/print.css"),
                            this.getFile("./css/echantillon.css"),
                            '</head>',
                            '<body>',
                            '<div class="content" id="echantillonsContent"></div>',
                            '</body> ',
                            `<script>`,
                            `_DATAPI = ${JSON.stringify(this.datas)}`,
                            '</script>',
                            this.getFile("./js/configuration.js"),
                            this.getFile("./js/constants.js"),
                            this.getFile("./js/libs/JsBarcode.all.min.js"),
                            this.getFile("./js/api/print.js"),
                            `<script>start()</script>`,
                            '</html>'].map((e: string) => e.trim());
    }

    toString() {
        return super.toString();
    }
}
