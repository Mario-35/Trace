/**
 * HTML Print for API.
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _NONCE } from "../../constant";
import { CoreHtmlView } from "./core";

/**
 * Print Class for HTML View
 */

export class Echantillon extends CoreHtmlView {
    datas: any;
    constructor() {
        super();

        this.createEchantillonHtmlString();
    }
   
    createEchantillonHtmlString() {
        this._HTMLResult = ['<!DOCTYPE html>',
                            '<html lang="en">',
                            '<head>',
                            '    <meta charset="UTF-8">',
                            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                            '    <title>Configuration</title>',
                            this.getFile("./css/form/configuration.css"),
                            this.getFile("./css/form/main.css"),
                            this.getFile("./css/main.css"),
                            this.getFile("./css/modal.css"),
                            this.getFile("./css/editingList.css"),
                            this.getFile("./css/splitter.css"),
                            '</head>',
                            '<body>',
                            '<div class="content" id="passeportsContent"></div>',
                            '</body> ',
                            '<script>',
                            `_DATAPI = ${JSON.stringify(this.datas)}`,
                            '</script>',
                            `<script nonce="${_NONCE}" src="./js/constants.js"></script>`,
                            `<script nonce="${_NONCE}" src="./js/api/print.js"></script>`,
                            '<script>start()</script>',
                            '</html>'].map((e: string) => e.trim());
    }

    toString() {
        return super.toString();
    }
}
