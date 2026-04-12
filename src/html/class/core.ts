
/**
 * Core Class to be extend for HTML Views
 */

import { EConstant } from "../../constant";
import { removeAllQuotes } from "../../helpers/removeAllQuotes";
import fs from "fs";
import path from "path";
import { removeComments } from "../../helpers/removeComments";

export class CoreHtmlView {
    _HTMLResult: string[];
    message: string | undefined;

    constructor() {
        this._HTMLResult =  [];
    }

      addFileMario(name: string): string {
      return fs.existsSync(name) ? fs.readFileSync(name, "utf-8") : fs.readFileSync(name.replace(".js", ".min.js"), "utf-8");
    }

    loadFile(name: string): string {
      return removeComments(fs.readFileSync(path.join(__dirname, "../../public/", name), "utf-8"));
      // return fs.existsSync(path.join("./public/", name)) 
        // : fs.readFileSync(path.join(__dirname, "/", name.replace(".css", ".min.css")), "utf-8");
    }


    mario() {
const operations: any = [];

      this._HTMLResult.forEach(e => {
    if (e.includes('rel="stylesheet"')) {
        const name = e.split('href="./')[1].split('"')[0];
        operations.push({
            search: e,
            file: name
        })
        
    } else if (e.includes("rel='stylesheet'")) {
        const name = e.split("href='./")[1].split("'")[0];
        operations.push({
            search: e,
            file: name
        });
    } else if (e.includes(`<script src="`)) {
        const name = e.split(`<script src="./')[1].split('"></script>`)[0];
        operations.push({
            search: e,
            file: name
        })
    }
}) 

operations.forEach((operation: any) => {
    this.replaceInReturnResult(operation.search, `<style>${this.addFileMario(path.resolve(__dirname, "../../public/", operation.file))}</style>`);

})
    }
    
    addFile(name: string): string {

      return fs.existsSync(path.join(__dirname, "/", name)) ? fs.readFileSync(path.join(__dirname, "/", name), "utf-8") : fs.readFileSync(path.join(__dirname, "/", name.replace(".js", ".min.js")), "utf-8");
    }
    
    getFile(name: string) {
        return name.includes('css/')
            ? `<style>${this.addFile(`../../public/${name}`)}</style>`
            : `<script>${this.addFile(`../../public/${name}`)}</script>`;
    }

    replaceFile(name: string) {
        if(name.includes('css/'))
            this.replaceInReturnResult(`<link rel="stylesheet" href="./${name}">`, `<style>${this.addFile(`../../public/${name}`)}</style>`);
            else this.replaceInReturnResult(`<script src="./${name}"></script>`, `<script>${this.addFile(`../../public/${name}`)}</script>`);
    }

    replaceText(name: string, content: string) {
        if(name.includes('css/'))
            this.replaceInReturnResult(`<link rel="stylesheet" href="./${name}">`, `<style>${content}</style>`);
            else this.replaceInReturnResult(`<script src="./${name}"></script>`, `<script>${content}</script>`);

    }

    replaceInReturnResult = (searhText: string, content: string) => {
        let index = this._HTMLResult.indexOf(searhText);
        if (index > 0) this._HTMLResult[index] = content;
        else {
            index = this._HTMLResult.indexOf(removeAllQuotes(searhText));
            if (index > 0) this._HTMLResult[index] = content;
        }
    };    


    social() {
        return `<div class="social-panel-container">
  <div class="social-panel">
    <p>Created by <a target="_blank" href="https://linktr.ee/adammario">ADAM mario</a></p>
    <button class="close-btn"> ❌ </button>
    <h4>Version : ${EConstant.version}</h4><h5> [${EConstant.date}]</h5>
    <ul>
      <li>
        <button type="button" id="git" class="patrom-button-bar__button size-lg" title="Github">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6c0-0.4,0-0.9,0.2-1.3 C7.2,6.1,7.4,6,7.5,6c0,0,0.1,0,0.1,0C8.1,6.1,9.1,6.4,10,7.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3c0.9-0.9,2-1.2,2.5-1.3 c0,0,0.1,0,0.1,0c0.2,0,0.3,0.1,0.4,0.3C17,6.7,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4 c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z"></path>
          </svg>
        </button>
      </li>
      <li>
        <button type="button" id="doc" class="patrom-button-bar__button size-lg" title="Documentation">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path class="svg-icon" d="M7 22v-16h14v7.543c0 4.107-6 2.457-6 2.457s1.518 6-2.638 6h-5.362zm16-7.614v-10.386h-18v20h8.189c3.163 0 9.811-7.223 9.811-9.614zm-10 1.614h-4v-1h4v1zm6-4h-10v1h10v-1zm0-3h-10v1h10v-1zm1-7h-17v19h-2v-21h19v2z" />
          </svg>
        </button>
      </li>
      <li>
        <button type="button" id="discord" class="patrom-button-bar__button size-lg" title="Discord chanel">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M19.98,5.69c-1.68-1.34-4.08-1.71-5.12-1.82h-0.04c-0.16,0-0.31,0.09-0.36,0.24c-0.09,0.23,0.05,0.48,0.28,0.52 c1.17,0.24,2.52,0.66,3.75,1.43c0.25,0.15,0.31,0.49,0.11,0.72c-0.16,0.18-0.43,0.2-0.64,0.08C15.56,5.38,12.58,5.3,12,5.3 S8.44,5.38,6.04,6.86C5.83,6.98,5.56,6.96,5.4,6.78C5.2,6.55,5.26,6.21,5.51,6.06c1.23-0.77,2.58-1.19,3.75-1.43 c0.23-0.04,0.37-0.29,0.28-0.52c-0.05-0.15-0.2-0.24-0.36-0.24H9.14C8.1,3.98,5.7,4.35,4.02,5.69C3.04,6.6,1.09,11.83,1,16.46 c0,0.31,0.08,0.62,0.26,0.87c1.17,1.65,3.71,2.64,5.63,2.78c0.29,0.02,0.57-0.11,0.74-0.35c0.01,0,0.01-0.01,0.02-0.02 c0.35-0.48,0.14-1.16-0.42-1.37c-1.6-0.59-2.42-1.29-2.47-1.34c-0.2-0.18-0.22-0.48-0.05-0.68c0.18-0.2,0.48-0.22,0.68-0.04 c0.03,0.02,2.25,1.91,6.61,1.91s6.58-1.89,6.61-1.91c0.2-0.18,0.5-0.16,0.68,0.04c0.17,0.2,0.15,0.5-0.05,0.68 c-0.05,0.05-0.87,0.75-2.47,1.34c-0.56,0.21-0.77,0.89-0.42,1.37c0.01,0.01,0.01,0.02,0.02,0.02c0.17,0.24,0.45,0.37,0.74,0.35 c1.92-0.14,4.46-1.13,5.63-2.78c0.18-0.25,0.26-0.56,0.26-0.87C22.91,11.83,20.96,6.6,19.98,5.69z M8.89,14.87 c-0.92,0-1.67-0.86-1.67-1.91c0-1.06,0.75-1.92,1.67-1.92c0.93,0,1.67,0.86,1.67,1.92C10.56,14.01,9.82,14.87,8.89,14.87z M15.11,14.87c-0.93,0-1.67-0.86-1.67-1.91c0-1.06,0.74-1.92,1.67-1.92c0.92,0,1.67,0.86,1.67,1.92 C16.78,14.01,16.03,14.87,15.11,14.87z"></path>
            </svg>
        </button>
      </li>
      <li>
        <button type="button" id="linkedin" class="patrom-button-bar__button size-lg" title="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M 21.125 0 L 4.875 0 C 2.183594 0 0 2.183594 0 4.875 L 0 21.125 C 0 23.816406 2.183594 26 4.875 26 L 21.125 26 C 23.816406 26 26 23.816406 26 21.125 L 26 4.875 C 26 2.183594 23.816406 0 21.125 0 Z M 8.039063 22.070313 L 4 22.070313 L 3.976563 9.976563 L 8.015625 9.976563 Z M 5.917969 8.394531 L 5.894531 8.394531 C 4.574219 8.394531 3.722656 7.484375 3.722656 6.351563 C 3.722656 5.191406 4.601563 4.3125 5.945313 4.3125 C 7.289063 4.3125 8.113281 5.191406 8.140625 6.351563 C 8.140625 7.484375 7.285156 8.394531 5.917969 8.394531 Z M 22.042969 22.070313 L 17.96875 22.070313 L 17.96875 15.5 C 17.96875 13.910156 17.546875 12.828125 16.125 12.828125 C 15.039063 12.828125 14.453125 13.558594 14.171875 14.265625 C 14.066406 14.519531 14.039063 14.867188 14.039063 15.222656 L 14.039063 22.070313 L 9.945313 22.070313 L 9.921875 9.976563 L 14.015625 9.976563 L 14.039063 11.683594 C 14.5625 10.875 15.433594 9.730469 17.519531 9.730469 C 20.105469 9.730469 22.039063 11.417969 22.039063 15.046875 L 22.039063 22.070313 Z"></path>
          </svg>
        </button>
      </li>
      <li>
        <button type="button" id="email" class="patrom-button-bar__button size-lg" title="Email">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path class="svg-icon" d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 9.236 2.247 15.968-3.405 15.968-9.457 0-5.812-5.701-10.007-12-10.007zm1 15h-2v-6h2v6zm-1-7.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
          </svg>
        </button>
      <li>
    </ul>
  </div>
</div>
<button class="floating-btn"> Contacts </button>`;
    }

    /**
     * replace in html page
     * @param key to search
     * @param value to replace
     */
    replacer(key: string, value: string) {
        this._HTMLResult = this._HTMLResult.map((e) => e.replace(key, value));
    }

    /**
     * meltiple replace in html page
     * @param values all replaces
     */
    replacers(values: object) {
        Object.keys(values).forEach((key) => {
            this.replacer(`@${key}@`, values[key as keyof object]);
        });
    }

    toArray() {
        return this._HTMLResult;
    }

    toString() {
        this.replacer("@social@", this.social());
        return this._HTMLResult.filter((e) => e !== "").join("");
    }

}
