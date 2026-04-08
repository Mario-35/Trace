/**
 * HTML Views First for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _NONCE, EConstant } from "../../constant";
import { dataBase } from "../../db/base";
import { CoreHtmlView } from "./core";

export class List extends CoreHtmlView {
    constructor(name: String, excel?: boolean) {
        super();		
        this.createIndexHtmlString(name, excel);
    }
    
    createIndexHtmlString(name: String, excel?: boolean) {
        // Split files for better search and replace
		const plural = name.toLocaleLowerCase() + 's';
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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion ljlkjdlkjsdl des ${plural}s</title>
    <link rel="stylesheet" href="./css/bootstrap.css">
    <link rel="stylesheet" href="./css/icons.css">
    <link rel="stylesheet" href="./css/context-menu.css">
    ${excel ? '<link rel="stylesheet" href="./css/import.css">' : ''}
    <link rel="stylesheet" href="./css/modal.css">
    <link rel="stylesheet" href="./css/splitter.css">
</head>

<body>
	<header id="splitter-nav-site" class="splitter-nav-site"></header>
    <main class="main-view">
        <div class="splitter-nav-view" id="left-pane">
        </div>
        <div class="v-drag" id="separator"></div>
        <div class="content" id="right-pane">
			<div class="card">
				<div class="card-header row">
					<div class="col-1">
						<span class="input-group-text">Par page</span>
					</div>
					<div class="col-1">
						<div class="input-group">
							<select id="perPageSelect" class="form-control">
								<option selected>25</option>
								<option >50</option>
								<option>100</option>
								<option>250</option>
								<option>500</option>
							</select>
						</div>
					</div>
					<div class="col-10">
						<div class="input-group">
							<span class="input-group-text">${name}</span>
							${dataBase[plural as keyof object].create === true ? `
								<div id="blockAjouter">
									<a class="btn btn-primary icon_plus" id="ajouter" href="./${name}-add.html"> Ajouter</a>								
								</div>
								` : ''}
                            ${ excel ? `
							<span class="input-group-text">Importer</span>
							<div class="btn btn-success field">
                            	<input type="file" name="file" id="fileone" class="inputfile inputfile-1" accept=".xls,.xlsx"
                                data-multiple-caption="{count} files selected" multiple />
                            	<label id="fileonelabel" for="fileone" class="icon_download"> Fichier excel</label>
							</div>` :''}
							<span class="input-group-text" id="globalSearchIcon">🔎 Cherche</span>
							<input id="globalSearch" type="text" class="form-control" placeholder="Recherche dans tous les champs">
						</div>
					</div>
				</div>
				<div class="table-responsive">
					<table id="jsonTable" class="table table-striped table-hover">
						<thead></thead>
						<tbody></tbody>
						<tfoot></tfoot>
					</table>
				</div>
				<div class="card-footer">
					<nav>
						<ul id="pagination" class="pagination justify-content-end"></ul>
					</nav>
				</div>
			</div>
        </div>
		
<div class="context-menu">
  <ul id = "contextMenu" class="context-menu-options">
  </ul>
</div>

		<div id="modal"></div>  
    </main>
</body> 
<script nonce="${_NONCE}" src="./js/api.js"></script>
<script>const structure = ${JSON.stringify(listCols)}</script>
<script nonce="${_NONCE}" src="./js/configuration.js"></script>
<script nonce="${_NONCE}" src="./js/constants.js"></script>
<script nonce="${_NONCE}" src="./js/all.js"></script>
<script nonce="${_NONCE}" src="./js/common/modal.js"></script>
<script nonce="${_NONCE}" src="./js/common/splitter.js"></script>
<script nonce="${_NONCE}" src="./js/common/menu.js"></script>  
<script nonce="${_NONCE}" src="./js/dataTables.js"></script>
<script nonce="${_NONCE}" src="./js/${plural}/list.js"></script>    
${excel ? `<script nonce="${_NONCE}" src="./js/libs/xlsx.full.min.js"></script>` : ''}
</html>
`.split(EConstant.newline)
            .map((e: string) => e.trim())
            .filter((e) => e.trim() != "");     
    }

    toString() {
        return super.toString();
    }
}
