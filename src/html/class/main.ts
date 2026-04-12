/**
 * HTML Views First for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../constant";
import { CoreHtmlView } from "./core";
import fs from "fs";
import path from "path";

/**
 * Query Class for HTML View
 */

export class Index extends CoreHtmlView {
    constructor() {
        super();
        this.createIndexHtmlString();
    }
    
    createIndexHtmlString() {
        // Split files for better search and replace
        this._HTMLResult = fs
            .readFileSync(path.resolve(__dirname, "../../public/", "index.html"))
            .toString()
            .split(EConstant.newline)
            .map((e: string) => e.trim())
            .filter((e) => e.trim() != "");

        this.replacer('"@DATAS@"', 'console.log("15-02-2026")');
        this.replaceFile("css/splitter.css");
        this.replaceFile("css/bootstrap.css");
        this.replaceFile("js/constants.js");        
        this.replaceFile("js/common/splitter.js");        
        this.replaceFile("js/common/menu.js");        
    }

    toString() {
        return super.toString();
    }
}
