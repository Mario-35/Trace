/**
 * HTML Views First for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { createConfig } from "@app/configuration/controller";
import { EConstant } from "../../constant";
import { dataBase } from "../../db/base";
import { IHTMLOptions } from "../../types";
import { CoreHtmlView } from "./core";

export class Add extends CoreHtmlView {
	config: any;
	configuration: any;
    constructor(name: String, config: any) {
        super();
		this.config = config;
		this.configuration  = createConfig();
		switch (name) {
			case "echantillon":
				this.createAddEchantillonHtmlString(name);
				break;
			case "site":
				this.createAddSiteHtmlString(name);
				break;
			case "evenement":
				this.createAddEvenementHtmlString(name);
				break;
		}
    }


	addCss(hrefs: string[]) {
		return hrefs.map(href => `<link rel="stylesheet" href="${href}">`).join("")
	}
    
	progressHeaders(hrefs: string[]) {
		return hrefs.map((name, index) => `<div class="step" id="step-${index + 1}">
												<span>
													${index + 1}
												</span> 
												<span class="step-label">
													${name}
												</span>
											</div> `)	
	}

	inputlabel(options: {
			name: String;
			label: String;
			tooltip?: String;
			tooltipFlow?: String;
		}) {
		return `<label for="${options.name}">
					${options.tooltip 	? `<span tooltip="${options.tooltip}" ${options.tooltipFlow  ? `flow="${options.tooltipFlow}"` : ''} >
												${options.label}
											</span>` 
										: options.label}					
				</label>`;
	}
	inputError(options: {
			name: String;
			label: String;
		}) {
		return `<div class="error-message" id="${options.name}-error">${options.label} obligatoire</div>`;
	}

	inputText(options: IHTMLOptions) {
		return `${this.inputlabel(options)}
				<input type="text" id="${options.name}" name="${options.name}" class="form-control" ${ options.max ? `maxlength=${options.max}"` : ''}  placeholder="${options.label}"  ${options.canedit ? `canedit="${options.canedit}"` : '' } ${options.readonly ? 'readonly' : ''} ${options.disabled ? 'disabled' : ''} />                           
				${options.error ? this.inputError(options) : ''} `;


				
	}

	inputFormGroupText(options: IHTMLOptions) {
		return `
			<div class="form-group row-${ options.size || 1}${options.invisible ? ' invisible' : '' } ">
				${this.inputText(options)}
			</div>`;
	}

	inputNumber(options: {
			name: String;
			label: String;
			size?: Number;
			placeholder: String;
			error?: boolean;
			readonly?: boolean;
			invisible?: boolean;
			min?: Number;
			max?: Number;
			value?: Number;
			tooltip?: String;
			tooltipFlow?: String;
			canedit?: String;
		}) {
		return `
			<div class="form-group row-${options.size || 1}${options.invisible ? ' invisible' : ''}">
				${this.inputlabel(options)}
                <input type="number" id="${options.name}" name="${options.name}"class="form-control"  ${options.min ? `min=${options.min}` : ''} ${options.max ? `max=${options.max}` : ''} value="${options.value || 0}"/>
				${options.error ? `<div class="error-message" id="${options.name}-error">${options.placeholder} obligatoire</div>` : ''}
			</div>`;
	}

	inputSelect(options: IHTMLOptions, parDef: string) {
		return `
			<div class="form-group row-${options.size || 1}${options.invisible ? ' invisible' : ''}">
				${this.inputlabel(options)}
				<select class="form-control" id="${options.name}" name="${options.name}" ${options.max ? `maxlength=${options.max}"` : ''} ${options.canedit ? `canedit="${options.canedit}"` : '' } ${options.readonly ? 'readonly' : ''}> 
				<option selected="selected">${parDef}</option>
				</select>
				${options.error ? this.inputError(options) : ''}
			</div>`;
	}

	inputHidden(name: string, value?: any) {										
		return `<input type="hidden" id="${name}" name="${name}" ${ value ? `value="${value}"` : ''} />`;
	}

	inputDate(options: IHTMLOptions) {
		return `
			<div class="form-group row-${options.size || 1}${options.invisible ? ' invisible' : ''}">
				${this.inputlabel(options)}
				<input type="date" id="${options.name}" name="${options.name}" class="form-control"   ${options.canedit ? `canedit="${options.canedit}"` : '' } ${options.readonly ? 'readonly' : ''} />                           
				${options.error ? this.inputError(options) : ''}
			</div>`;
	}
	inputDateTime(options: IHTMLOptions) {
		return `
			<div class="form-group row-${options.size || 1}${options.invisible ? ' invisible' : ''}">
				${this.inputlabel(options)}
				<input type="time" step="1" id="${options.name}" name="${options.name}" class="form-control"   ${options.canedit ? `canedit="${options.canedit}"` : '' } ${options.readonly ? 'readonly' : ''} />                           
				${options.error ? this.inputError(options) : ''}
			</div>`;
	}

	inputBtn(options: IHTMLOptions, btnTypeAndClass: string, btnLabel: string) {
		return `<div class="form-group row-${options.size || 1}${options.invisible ? ' invisible' : ''}">
					<button class="btn ${btnTypeAndClass}" id="${options.name}" title="${options.tooltip}" ${options.disabled ? 'disabled' : ''}>
						${btnLabel}
					</button>
				</div>`;
	}
	inputChk(options: IHTMLOptions, checked: boolean) {
		return `<input type="checkbox" id="${options.name}" name="${options.name}" ${checked === true ? 'checked' : ''}>
`;
	}

	inputMap(name: string) {
		return `<div id="${name}" style="width: 600px; height: 400px;">
				</div>`;
	}

	inputTextArea(name: string, invisible: boolean) {
		return `<textarea id="${name}" name="${name}" class="form-control ${invisible ? 'invisible' : ''}">
				</textarea>`;	
	}

	rangeHTML() {
		return `<div class="form-row">                     
					<div class="fillFull" id="rowLines" >
					</div>
				</div>  

				<div class="form-row">                       
					<div class="form-group row-1 invisible">
						<label for="row" id="rowNumber">
						</label>
					</div>
				</div>`;
	};

    createAddEvenementHtmlString(name: String) {
        this._HTMLResult =`
			<!DOCTYPE html>
			<html lang="fr">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>
					Ajout d'échantillon(s)
				</title>
				${this.addCss([ "./css/print.css", "./css/echantillon.css", "./css/passeport.css", "./css/form/main.css", "./css/main.css", "./css/modal.css", "./css/editingList.css", "./css/splitter.css"])}				
			</head>

			<body>
				<header id="splitter-nav-site" class="splitter-nav-site"></header>
				<form id="actionForm" class="formData" enctype="multipart/form-data" method="POST">
					${this.inputHidden("ctx")}
					<main class="main-view">
						<div class="splitter-nav-view" id="left-pane"></div>
						<div class="v-drag" id="separator"></div>
						<div class="content" id="right-pane">
							<div class="container">
								<div class="header">
									<h1 id="formTitle"></h1>
								</div>

								<!-- Steps Headers-->            
                    
								<div class="form-container">

									<div class="form-row">
										${this.inputDate({
											size: 2,
											name: "date",
											tooltip: "Date au format JJ/MM/AAAA",
											label: "Date de l'opération",
											error: true,
										})}

										${this.inputDateTime({
											size: 2,
											name: "time",
											tooltip: "Date au format HH/MM/SS",
											label: "Heure de l'opération",
											error: true,
										})}										
										
										${this.inputFormGroupText({
											max: 16,
											size: 2,
											name: "identification",
											tooltip: "Identification (Généré automatiquement)",
											label: "Identification",
											error: true,
											readonly: true,
											canedit: "never",
										})}
										
										${this.inputSelect({
											size: 2,
											max: 10,
											name: "etat",
											tooltip: "Etat du prélévement",
											label: "Etat du prélévement",
											placeholder: "label",
											canedit: "true",
										}, 'Créer')}

									</div>

									<div class="form-row">
										${this.inputFormGroupText({
											max: 30,
											name: "personne",
											tooltip: "Personne @ l'origine de l'événement / opération",
											label: "Personne (Qui)",
											canedit: "true"
										})}                              
										${this.inputFormGroupText({
											max: 75,
											name: "operation",
											tooltip: "Detail de l'événement / opération",
											label: "Detail de l'operation",
											canedit: "true"
										})}                              
									</div>              

									${this.rangeHTML()}
									
									<div class="form-row container-center">
										<input type="hidden" id="stockage" name="stockage" class="form-control">
										<div id="stockageList" class="liste"></div>
									</div> 
							
									<div class="btn-group">
										<button class="btn btn-warning form-group float-start" id="btn-annuler">❌ Annuler</button>
										<button class="btn btn-primary form-group float-end" type="submit" id="btn-creer">✔️️ Créer</button>
									</div>
									${this.inputHidden("saveetat")}
									${this.inputTextArea("savestockage", true)}
								</div>						
                    		</div>
                		</div>
        			</main> 
    			</form>
    			<div id="modal"></div>  
			</body> 

    <!-- awlays first -->
    <script src="./js/configuration.js"></script>
    <script src="./js/constants.js"></script>
    <script src="./js/all.js"></script>
    <script src="./js/common/splitter.js"></script>
    <script src="./js/common/menu.js"></script>
    <script src="./js/form.js"></script>
    <script src="./js/api.js"></script>
    <script src="./js/api/rpg.js"></script>
    <script src="./js/helper.js"></script>
    <script src="./js/common/modal.js"></script>   
    <script src="./js/common/editingList.js"></script>
    <script src="./js/evenements/add.js"></script>
    <script src="./js/evenements/event.js"></script>    
    <script src="./js/evenements/controller.js"></script>
</html>
`.split(EConstant.newline)
            .map((e: string) => e.trim())
            .filter((e) => e.trim() != "");   







	}

    createAddSiteHtmlString(name: String) {
        // Split files for better search and replace
		const plural = name.toLocaleLowerCase() + 's'
		const listCols:any = [];
		const src = dataBase[plural as keyof object].columns;
		Object.keys(src).filter((e: any) => src[e].list === true).forEach(e => {
			listCols.push({
				key: e,
				title: src[e].title,
				searchType: src[e].searchType || "text"
			});
		});
        this._HTMLResult =`
			<!DOCTYPE html>
			<html lang="fr">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Ajout d'échantillon(s)</title>
				${this.addCss(["./css/form/main.css", "./css/main.css", "./css/modal.css", "./css/main.css", "./css/splitter.css", "./leaflet/leaflet.css"])}
			</head>

<body>
	<header id="splitter-nav-site" class="splitter-nav-site"></header>
    <form id="actionForm" class="formData" enctype="multipart/form-data" method="POST">
       ${this.inputHidden("ctx")}
    <main class="main-view">
        <div class="splitter-nav-view" id="left-pane">
        </div>
            <div class="v-drag" id="separator"></div>
            <div class="content" id="right-pane">
                <div class="container">
                    <div class="header">
                        <h1 id="formTitle"></h1>
                    </div>                    
                    <div class="form-container">
                        <!-- Step 1: Prélevement -->
                        <div class="form-step active">
                                <div class="form-row">
                                    <div class="form-group row-1">
										${this.inputText({
											max: 25,
											name: "nom",
											label: "Nom du site",
											tooltip: "Nom du site permettant les rapprochements lors des recherches",
											tooltipFlow: "right",
											error: true,
										})}
										${this.inputText({
											max: 25,
											name: "pays",
											label: "Pays",
											tooltip: "Pays du site géographique",
											tooltipFlow: "right",
											error: true,
										})}
										${this.inputText({
											max: 30,
											name: "region",
											label: "Région",
											tooltip: "Saisissez le code postal sur 2 ou 5 chiffres pour effectuer une recherche",
											tooltipFlow: "right",
											error: true,
										})}
										${this.inputText({
											name: "latitude",
											label: "Latitude",
											tooltip: "Latitude en degré décimal au format WGS84",
											tooltipFlow: "right",
											error: true,
										})}
										${this.inputText({
											name: "longitude",
											label: "Longitude",
											tooltip: "Longitude en degré décimal au format WGS84",
											tooltipFlow: "right",
											error: true,
										})}
										<hr>
																		${this.inputBtn({
									name: "btnApiRpg",
									label: "Interroger",
									disabled: true,
									tooltip: "Interroger Registre Parcellaire Graphique",
								}, "btn-api form-group float-end", "🌍 Registre Parcellaire Graphique")}

                                    </div>
                                    <div class="form-group row-1">
										${this.inputMap("map")}                                        
                                    </div>                                    
                                </div>

                                <div class="form-row">
                                    <div class="form-group row-1" id="rpgTab"></div>  
                                </div>

                            <div class="btn-group">
                                <button class="btn btn-warning form-group float-start" id="btn-annuler">❌ Annuler</button>
                                <button class="btn btn-primary form-group float-end" type="submit" id="btn-creer">✔️️ Créer</button>
                            </div>
                            <textarea id="cultures" class="form-control invisible" name="cultures"></textarea>
                        </div>                
                    </div>
                </div>

                
                
            </div>
        </main>
    </form>
    <div class="modal-container">
      <input id="modal-toggle" type="checkbox">
      <label class="modal-backdrop" id="modal-ouside"></label>  
      <div id="modal" class="modal-content"> 
      </div>          
    </div>  
</body> 

<!-- awlays first -->
<script src="./js/configuration.js"></script>
<script src="./js/constants.js"></script>
<script src="./js/all.js"></script>
<script src="./js/common/splitter.js"></script>
<script src="./js/common/menu.js"></script>
<script src="./js/form.js"></script>
<script src="./js/api.js"></script>
<script src="./js/api/rpg.js"></script>
<script src="./js/helper.js"></script>
<script src="./js/common/modal.js"></script>
<script src="./leaflet/leaflet.js"></script>
<script src="./js/sites/add.js"></script>
<script src="./js/common/regions.js"></script>     
<script src="./js/sites/event.js"></script>   
<script src="./js/sites/controller.js"></script>
</html>
`.split(EConstant.newline)
            .map((e: string) => e.trim())
            .filter((e) => e.trim() != "");     
    }

	createAddEchantillonHtmlString(name: String) {
        // Split files for better search and replace
		const plural = name.toLocaleLowerCase() + 's'
		const listCols:any = [];
		const src = dataBase[plural as keyof object].columns;
		Object.keys(src).filter((e: any) => src[e].list === true).forEach(e => {
			listCols.push({
				key: e,
				title: src[e].title,
				searchType: src[e].searchType || "text"
			});
		});
        this._HTMLResult =`
			<!DOCTYPE html>
			<html lang="fr">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Ajout d'échantillon(s)</title>
				${this.addCss([ "./css/print.css", "./css/echantillon.css", "./css/passeport.css", "./css/form/main.css", "./css/main.css", "./css/modal.css", "./css/editingList.css", "./css/splitter.css"])}				
			</head>

			<body>
				<header id="splitter-nav-site" class="splitter-nav-site"></header>
				<form id="actionForm" class="formData" enctype="multipart/form-data" method="POST">
					${this.inputHidden("ctx")}
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
									${this.progressHeaders(["Prélevement", "Localisation", "Analyses", "Stockage", "Etiquettes"])}
								</div>
                    
								<div class="form-container">
									<!-- Step 1: Prélevement -->
									<div class="form-step active" id="form-step-1">
										${this.inputHidden("creation")}
										<div class="form-row">
											${this.inputSelect({
												max: 15,
												name: "type",
												tooltip: "Type de prélévement",
												label: "Type de prélévement",
												placeholder: "label",
												canedit: "notNull",
												error: true
											},'---- Aucun ----')}
                                
										<div class="form-group row-2">
												<input type="checkbox" id="pedagogique" name="pedagogique">
												<label for="pedagogique"><span class="pipo" tooltip="Programme concerné par le prélévement coché la case en cas de programme pédagogique">Programme</span></label>
											<input type="text" id="programme" name="programme" class="form-control" maxlength="25" placeholder="Nom du programme" />                              
											<div class="error-message" id="programme-error">Nom du programme obligatoire</div>
										</div>
									</div>

									<div class="form-row">
										${this.inputFormGroupText({
											size: 2,
											max: 25,
											name: "site",
											label: "Site de prélèvement",
											tooltip: "Site géographique de prélévement",
											error: true,
											tooltipFlow: "right",
										})}

										${this.inputFormGroupText({
											size: 2,
											max: 25,
											name: "responsable",
											tooltip: "Personne responsable du programme / prélèvement",
											label: "Nom du responsable",
											error: true,
										})}
									</div>

									<div class="form-row">
										${this.inputFormGroupText({
											max: 16,
											name: "parent",
											tooltip: "Identification de l'échantillon parent",
											label: "Echantillon Parent",
											error: true,
											readonly: true,
											invisible: true,
											canedit: "never",
										})}

										${this.inputFormGroupText({
											max: 16,
											name: "identification",
											tooltip: "Identification (Généré automatiquement)",
											label: "Identification",
											error: true,
											readonly: true,
											canedit: "never",
										})}

										${this.inputNumber({
											min: 0,
											max: 9998,
											name: "dossier",
											tooltip: "Numéro de dossier interne",
											label: "N° de dossier",
											placeholder: "label",
										})}

										${this.inputSelect({
											max: 10,
											name: "etat",
											tooltip: "Etat du prélévement",
											label: "Etat du prélévement",
											placeholder: "label",
											canedit: "true",
										},'Créer')}

										${this.inputNumber({
											min: 1,
											value: 1,
											max: 9998,
											name: "numero",
											tooltip: "Numéro de départ de la numérotation des échantillons",
											placeholder: "label entre 1 et 9998",
											label: "N° de départ",
											error: true,
											invisible: true,
										})}

										<div class="form-group row-1 invisible"> 
											${this.inputHidden("analysesNombre")}
											<input type="checkbox" id="nombreOuAnalyses" name="nombreOuAnalyses" checked>
											<label for="nombreOuAnalyses"><span tooltip="Nombre de prélevement(s) à créer / ou à créer depuis la liste des analyses">Nombre / Analyses</span></label>
											<input type="number" id="nombre" name="nombre" class="form-control"  min="1" max = "9998" value="1"/>
											<div class="error-message" id="nombre-error">Compris entre 1 et 9998</div>
										</div>								

										${this.inputNumber({
											min: 1,
											value: 1,
											max: 9998,
											name: "echantillon",
											tooltip: "Numéro d'échantillon présent dans le fichier d'importation",
											placeholder: "label entre 1 et 9998",
											label: "N° de d'échantillon",
											error: true,
											invisible: true,
										})}								
									</div>                            

									<div class="form-row">
										${this.inputDate({
												name: "prelevement",
												tooltip: "Date du prélèvement au format JJ/MM/AAAA",
												label: "Date du prélevement",
												error: true,
										})}

										${this.inputDate({
												name: "peremption",
												tooltip: "Date de péremption au format JJ/MM/AAAA",
												label: "Date de péremption",
												error: true,
										})}

										${this.inputFormGroupText({
											size: 2,
											max: 25,
											name: "condition",
											tooltip: "Condition de prélèvement",
											label: "Condition de prélèvement",
											error: true,
										})}
									</div>

									<div class="form-row">
										${this.inputFormGroupText({
											size: 2,
											max: 75,
											name: "libre",
											tooltip: "Infos libre sélectionnable lors de l'impression des étiquettes",
											label: "Infos libre",
											canedit: "true"
										})}                              
									</div>                            
									
									${this.rangeHTML()}
									
									<div id="blockDemo" class="form-row">
										<div class="form-group row-1">                                
											<label for="demos">Données de démonstration</label>
											<select class="form-control" id="demos"></select>                
										</div> 
									</div>  
									
									<div class="btn-group">                   
										<button tooltip="L'état ne peut être créer ou importer" class="btn btn-aliquote" id="btn-aliquote" disabled>⬅ Créer une aliquote</button>
										<button class="btn btn-next" id="next-1">Suivant ➡</button>
									</div>
								</div>
                        
                        <!-- Step 2: Localisation -->
                        <div class="form-step" id="form-step-2"> 
                            <div class="form-row">
                                <div class="error-message" id="site-create-error">Le site </div>
								${this.inputFormGroupText({
									size: 2,
									max: 25,
									name: "nomSite",
									label: "Nom du site",
									tooltip: "Nom du site géographique",
									error: true,
									tooltipFlow: "right",
								})}
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
								
								${this.inputBtn({
									name: "btnApiRpg",
									label: "Interroger",
									tooltip: "Interroger Registre Parcellaire Graphique",
								}, "btn-add form-group float-end", "🌍 RPG")}

								${this.inputBtn({
									name: "btnAddSite",
									label: "Interroger",
									tooltip: "Création du site",
								}, "btn-add form-group float-end", "Créer")}
                            </div>

                            <div class="form-row">
                                <div class="form-group row-1" id="rpgTab"></div>  
                            </div>

                            <div id="SOLSCULTIVÉ">
                                <div id="blockPasseport" class="form-row"></div>                                
								${this.inputHidden("risqueRpg", "-1")}
								${this.inputHidden("passeport", "0")}
                            </div>
                            
                            <div class="btn-group">
                                <button class="btn btn-prev" id="prev-2">⬅ Précédent</button>
                                <button class="btn btn-next" id="next-2">Suivant ➡</button>
                            </div>
							${this.inputTextArea("cultures", true)}
                        </div>
                        
                        <!-- Step 3: Analyses -->
                        <div class="form-step" id="form-step-3">                          
                            <div class="form-row container-center">
								${this.inputHidden("analyses")}
                                <div id="analysesList" class="liste form-control"></div>
                            </div> 

                            <div class="btn-group">
                                <button class="btn btn-prev" id="prev-3">⬅ Précédent</button>
                                <button class="btn btn-next" id="next-3">Suivant ➡</button>
                            </div>
                        </div>
                        <!-- Step 3: Stockage -->
                        <div class="form-step" id="form-step-4">                          

							<div class="form-row container-center">
								${this.inputTextArea("stockage", true)}
								<div id="stockageList" class="liste"></div>
							</div> 

                            <div class="btn-group">
                                <button class="btn btn-prev" id="prev-3">⬅ Précédent</button>
                                <button class="btn btn-next" id="next-3">Suivant ➡</button>
                            </div>
							
                        </div>
                        
                        <!-- Step 4: Etiquettes -->
                        <div class="form-step" id="form-step-5">                          
                            <div class="form-row">
                                <div class="form-group row-2">
                                    <label for="element" id="elementLabel">Element
                                        <span tooltip="LONG">NOM</span>
                                    </label>
                                    <select id="element" class="form-control"> </select>
                                </div>

                                ${this.inputFormGroupText({
									name: "texte",
									label: "Texte Libre",
									tooltip: "Texte Libre",
									error: true,
									max: 50
								})}	


								${this.inputSelect({
									name: "textSize",
									tooltip: "Taille de texte à imprimer",
									label: "Taille",
									placeholder: "Taille",
								},  '10px')}

                                <div class="form-group row-1">                                    
                                    <label>Alignement
                                        <span tooltip="LONG">NOM</span>
                                    </label>
                                    <select id="textAlign" class="form-control">
                                        <option value="left">Gauche</option>
                                        <option value="center" selected>Centre</option>
                                        <option value="right">Droite</option>
                                    </select> 
                                </div>                         
                            </div>
							
                            <div class="form-row">
                                <div class="form-group row-1">
                                    <button class="btn btn-test" id="printEtiquette">Imprimer</button>
                                </div>                            
                                <div class="form-group row-3">
                                    <div id="gabaritEtiquette"></div>
                                </div>
                            </div>  

                            <div class="btn-group">
                                <button class="btn btn-prev" id="prev-4">⬅ Précédent</button>
                                <button class="btn btn-next" id="btn-creer">✔️️ Créer</button>
                            </div>
							${this.inputTextArea("etiquette", true)}
                        </div>
                    </div>
                </div>
            </div>
        </main> 
    </form>
    <div id="modal"></div>  
</body> 

    <!-- awlays first -->
    <script src="./js/configuration.js"></script>
    <script src="./js/constants.js"></script>
    <script src="./js/all.js"></script>
    <script src="./js/common/splitter.js"></script>
    <script src="./js/common/menu.js"></script>
    <script src="./js/form.js"></script>
    <script src="./js/api.js"></script>
    <script src="./js/api/rpg.js"></script>
    <script src="./js/helper.js"></script>
    <script src="./js/common/modal.js"></script>
    <script src="./js/echantillons/demo.js"></script>
    <script src="./js/libs/JsBarcode.all.min.js"></script>
    <script src="./js/api/print.js"></script>
    <script src="./js/common/regions.js"></script>    
    <script src="./js/common/editingList.js"></script>
    <script src="./js/echantillons/add.js"></script>
    <script src="./js/echantillons/event.js"></script>    
    <script src="./js/echantillons/controller.js"></script>
    <script src="./js/stickers/controller.js"></script>
    <script src="./js/echantillons/specific/passeports-phyto-sanitaires.js"></script>
</html>
`.split(EConstant.newline)
            .map((e: string) => e.trim())
            .filter((e) => e.trim() != "");     
    }

    toString() {
        return super.toString();
    }
}
