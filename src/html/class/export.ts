/**
 * HTML Print for API.
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { executeSql } from "../../db";
import { dataBase } from "../../db/base";
import { CoreHtmlView } from "./core";

/**
 * Print Class for HTML View
 */

export class Export extends CoreHtmlView {
    datas: any;
    constructor(datas: any) {
        super();
        this.datas = datas;
        this.createExportHtmlString();
    }
   
    createExportHtmlString() {        
        this._HTMLResult = ['<!DOCTYPE html>',
                            '<html lang="en">',
                            '<head>',
                            '    <meta charset="UTF-8">',
                            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                            '    <title>Configuration</title>',
                            this.getFile("./css/form/configuration.css"),
                            this.getFile("./css/form/main.css"),
                            this.getFile("./css/main.css"),
                            '</head>',
                            '<body>',
                            '<div class="content" id="passeportsContent"></div>',
                            '</body> ',
                            `<script>`,
                            `const _DATAS = ${JSON.stringify(this.datas)}`,
                            '</script>',
                            '<script src="./js/libs/xlsx.full.min.js"></script>',
                            `<script src="./js/export.js"></script>`,
                            '</html>'].map((e: string) => e.trim());

    }

    toString() {
        return super.toString();
    }
}
