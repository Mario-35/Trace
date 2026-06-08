/**
 * HTML Views First for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../constant";
import fs from "fs";
import path from "path";
import { CoreHtmlView } from "./core";

export class Documentation extends CoreHtmlView {
    constructor(page: string) {
        super();
        this.createExportHtmlString(page);
    }
   
    createExportHtmlString(page: string) {   
        const pg = fs
            .readFileSync(path.resolve(__dirname, "../../public/documentation/", page))
            .toString()
            .split(EConstant.newline)
            .map((e: string) => e.trim())
            .filter((e) => e.trim() != "");
        

        this._HTMLResult = [
'<!DOCTYPE html>',
'<html lang="en">',
'<head>',
'    <meta charset="UTF-8">',
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
'    <title>Gestion de échantillons</title>',
'    <link rel="stylesheet" href="../css/splitter.css">',
'    <link rel="stylesheet" href="../css/bootstrap.css">',
'    <link rel="stylesheet" href="../css/menu.css">',
'</head>',
'<body>',
'	<header id="splitter-nav-site" class="splitter-nav-site"></header>',
'    <main class="main-view">',
'        <div class="splitter-nav-view" id="left-pane"></div>',
'        <div class="v-drag" id="separator"></div>',
'        <div class="content" id="right-pane">',
... pg,
'   </div>',
'   </main>',
'</body>',
'<script src="../js/all.js"></script>',
'<script src="../js/configuration.js"></script>',
'<script src="../js/constants.js"></script>',
'<script src="../js/common/splitter.js"></script>',
'<script src="../js/common/menu.js"></script>',
'</html>'].map((e: string) => e.trim());

    }

    toString() {
        return super.toString();
    }    
}