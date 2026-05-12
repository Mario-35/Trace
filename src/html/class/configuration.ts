/**
 * HTML Views First for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../constant";
import { readId } from "../../controller";
import { dataBase } from "../../db/base";
import { CoreHtmlView } from "./core";
import fs from "fs";
import path from "path";

/**
 * Query Class for HTML View
 */

export class Configuration extends CoreHtmlView {
    datas: any;
    constructor(configuration: any) {
        super();
        this.datas = configuration;
        this.createConfigurationHtmlString();
    }
    
    async createConfigurationHtmlString() {
        // const conf = fs
        //     .readFileSync(path.resolve(__dirname, "../../public/js/", "configuration.js"))
        //     .toString().replace("_CONFIGURATION = ","").replace("};","}");
     
            

        this._HTMLResult =`
			<!DOCTYPE html>
			<html lang="fr">
			${this.createHead("Configuration", [ "form/configuration.css", "form/main.css", "main.css", "modal.css", "editingList.css", "splitter.css", "menu.css"])}
			<body>
				<header id="splitter-nav-site" class="splitter-nav-site"></header>
				<form id="actionForm" class="formData" enctype="multipart/form-data" method="POST">
					<main class="main-view">
						<div class="splitter-nav-view" id="left-pane">
						</div>
						<div class="v-drag" id="separator"></div>
						<div class="content" id="right-pane">
							<div class="container">
								<div class="header">
									<h1 id="formTitle"></h1>
								</div>
								<!-- Steps Headers-->            
								<div class="progress-bar">
									<div class="progress-bar-line" id="progress-line"></div>
									${this.progressHeaders(["Général", "Stockage", "Etats", "Listes",  "Etiquettes"])}
								</div>
                    
								<div class="form-container">
									<!-- Step 1: Général -->
									<div class="form-step active" id="form-step-1">
										${this.inputHidden("creation")}
										<div class="form-row">
										${this.inputFormGroupText({
											size: 2,
											max: 25,
											name: "site",
											tooltip: "Nom de l'unité",
											label: "Nom de l'unité",
											error: true,
										})}
                                
										<div class="form-group row-2">
												<input type="checkbox" id="debug" name="debug">
												 <label for="debug">Mode debug</label>
										</div>
									</div>

                                    <div class="form-row">
                                        ${this.inputFormGroupText({
                                            max: 25,
                                            name: "pays",
                                            label: "Pays",
                                            tooltip: "Pays du site géographique",
                                            error: true,
                                        })}
                                        ${this.inputFormGroupText({
                                            max: 30,
                                            name: "region",
                                            label: "Région",
                                            tooltip: "Saisissez le code postal sur 2 ou 5 chiffres pour effectuer une recherche",
                                            error: true,
                                        })}
                                        ${this.inputFormGroupText({
                                            name: "latitude",
                                            label: "Latitude",
                                            tooltip: "Latitude en degré décimal au format WGS84",
                                            error: true,
                                        })}
                                        ${this.inputFormGroupText({
                                            name: "longitude",
                                            label: "Longitude",
                                            tooltip: "Longitude en degré décimal au format WGS84",
                                            error: true,
                                        })}
                                    </div>

                                    <div class="form-row">
                                        ${this.inputFormGroupText({
                                            max: 10,
                                            name: "code",
                                            label: "Code ISO",
                                            tooltip: "Code ISO pour le passeport Phytosanitaire",
                                            error: true,
                                        })}
                                        ${this.inputFormGroupText({
                                            max: 10,
                                            name: "identifiant",
                                            label: "Identifiant",
                                            tooltip: "Identifiant délivré par les autorités",
                                            error: true,
                                        })}
                                    </div>  
									
                                    <div class="btn-group">                        
                                        <button class="btn btn-prev" id="prev-1" disabled>⬅ Précédent</button>
                                        <button class="btn btn-next" id="next-1">Suivant ➡</button>
                                    </div>
								</div>

                        <!-- Step 2: Stockage -->
                        <div class="form-step" id="form-step-2">
                            <div class="form-row container-center">
                                <input type="hidden" id="stockages" name="stockages" class="form-control">
                                <div id="stockagesList" class="liste"></div>
                            </div> 

                            <div class="btn-group">
                                <button class="btn btn-prev" id="prev-2">⬅ Précédent</button>
                                <button class="btn btn-next" id="next-2">Suivant ➡</button>
                            </div>
                        </div>                                
                        
                        <!-- Step 3: Etats -->
                        <div class="form-step" id="form-step-3">  
                            <div class="form-row container-center">
                                <input type="hidden" id="etats" name="etats" class="form-control">
                                <div id="etatsList" class="liste"></div>
                            </div> 

                            <div class="btn-group">
                                <button class="btn btn-prev" id="prev-3">⬅ Précédent</button>
                                <button class="btn btn-next" id="next-3">Suivant ➡</button>
                            </div>                            
                        </div>

                        <!-- Step 4: Listes -->
                        <div class="form-step" id="form-step-4">  
                            <div class="form-row">
                                <div class="row-2">
                                    <label for="excelSelect" id="excelSelectLabel">Element impotable depuis excel</label>
                                    <select multiple name="excelSelect" id="excelSelect" class="form-control"></select>
                                </div>
                            </div> 

                            <div class="btn-group">
                                <button class="btn btn-prev" id="prev-4">⬅ Précédent</button>
                                <button class="btn btn-next" id="next-4">Suivant ➡</button>
                            </div>                            
                        </div>
                        
                        <!-- Step 5: Etiquettes -->
                        <div class="form-step" id="form-step-5">    
                            <div class="form-row">
                                <div class="form-group row-2">
                                    <label for="element" id="elementLabel">Element</label>
                                    <select id="element" class="form-control"> </select>
                                </div>
                                <div class="form-group row-3">
                                    <label for="texte">Texte Libre</label>
                                    <input type="text" id="texte" class="form-control" maxlength="50" placeholder="Texte Libre">
                                </div>
                                <div class="form-group row-1">
                                    <label>Taille</label>
                                    <select id="textSize" class="form-control">
                                        <option >8px</option>
                                        <option selected>10px</option>
                                        <option>12px</option>
                                        <option>14px</option>
                                        <option>16px</option>
                                    </select> 
                                </div>                                   
                                <div class="form-group row-1">                                    
                                    <label>Alignement</label>
                                    <select id="textAlign" class="form-control">
                                        <option value="left">Gauche</option>
                                        <option value="center" selected>Centre</option>
                                        <option value="right">Droite</option>
                                    </select> 
                                </div>                         
                            </div>                            
                            <div class="form-row">
                                <div class="form-group row-1">
                                    <button class="btn btn-test" id="testPrintEtiquette">Imprimer</button>
                                </div>                            
                                <div class="form-group row-3">
                                    <div id="gabaritEtiquette"></div>
                                </div>

                            </div>                            

                            <div class="btn-group">
                                <button class="btn btn-prev" id="prev-5">⬅ Précédent</button>
                                <button class="btn btn-next" id="btn-creer">✔️️ Modifier</button>
                            </div>  
                            <textarea id="etiquette" name="etiquette"></textarea>                                                
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </main> 
    </form>
    <div id="modal"></div>  
</body> 

<script>"@DATAS@"</script>
<script src="js/configuration.js"></script>
<script src="js/constants.js"></script>
<script src="js/all.js"></script>
<script>const conf = ${JSON.stringify(this.datas)};
Object.keys(conf).forEach((e) => getElement(e) ? getElement(e).value = conf[e] : '' );
</script>
    <script src="js/common/splitter.js"></script>
    <script src="js/common/menu.js"></script>
    <script src="js/common/editingList.js"></script>
    <script src="js/form.js"></script>
    <script src="js/api.js"></script>
    <script src="js/helper.js"></script>
    <script src="js/common/modal.js"></script>
    <script src="js/libs/JsBarcode.all.min.js"></script>
    <script src="js/api/print.js"></script>
    <script src="js/configurations/add.js"></script>
    <script src="js/common/regions.js"></script>
    <script src="js/configurations/event.js");></script>
    <script src="js/stickers/controller.js"></script>
    <script src="js/configurations/controller.js"></script>
</html>
`.split(EConstant.newline)
            .map((e: string) => e.trim())
            .filter((e) => e.trim() != "");  
            
            


            this.replacer('"@DATAS@"', `
                const excelColumns = ["${Object.keys(dataBase.echantillons.columns).filter(e => dataBase.echantillons.columns[e].excel).join('","')}"];
                const stickerElements = {${Object.keys(dataBase.echantillons.columns).filter(e => dataBase.echantillons.columns[e].etiquette).map(e => `"${e}" : "${dataBase.echantillons.columns[e].etiquette}"`)}};
                `);

    }

    toString() {
        return super.toString();
    }
}
