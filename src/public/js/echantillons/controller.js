// create identification with date time (without seconds) and echantillon number
function createIdentification(nb) {
    if (isContextMode(['new',"aliquote"])) {
        if(!_DATE) _DATE = new Date();
        creation.value = _DATE.toISOString();
        return `${ _DATE.toLocaleDateString()}${ _DATE.toLocaleTimeString()}`.replace(/\D/g, "").slice(0,12) + (nb || getElement("echantillon").value || getElement("numero").value).padStart(4, '0');
    }
}

// refresh type that fixe mask
function refreshType() {
    const names = [];
    for (var j = 0; j < getElement("type").options.length; j++) {
        if (getElement("type").options[j].value !== _AUCUN) 
        names.push(getElement("type").options[j].value.replace(/\s/g, '').toUpperCase());
    }
    const key = getElement("type").value.replace(/\s/g, '').toUpperCase();
    setVisible(names, key);
}

function valueIfChecked(element, elementTest, text, textChecked) {
    element.innerText = `${text}${elementTest.checked ? ` ${textChecked}` : ""}`
}

// Refresh screen information
function refresh() {
    head('refresh');  
    // create identification
    if(!identification.value) {
        identification.value = createIdentification();
    }
    // identification reaonly
    // setReadOnly("identification");
    // peremption date
    if(!getElement("peremption").value) { 
        if(getElement("prelevement").value) { 
            const dates = getElement("prelevement").value.split("-");
            getElement("peremption").value = `${+dates[0] + 5}-${dates[1]}-${dates[2]}`;
        }
    }

    try {
        const tmp = toJson("stockage");
        getElement("stockageTab").innerHTML = getElement("stockage").value  
            ? `<table class="table table-stockage"> 
            <thead> 
                <tr> 
                    <th>&nbsp;Clé&nbsp;</th> 
                    <th>&nbsp;Valeur&nbsp;</th> 
                </tr> 
            </thead> 
            <tbody> ${Object.keys(tmp).map((e,i) => `<tr><td>${e}</td><td>${tmp[e]}</td>
                </tr>`).join("")} 
            </tbody> 
        </table>` 
            : '';   
    } catch (error) {    
        log(error);
    } 
    
    if(_CONFIGURATION.debug === false) {
        setInvisible("stockage");
        setInvisible("etiquette");
        setInvisible("cultures");
    }  
    
    valueIfChecked(pedagogique.nextSibling.nextSibling, pedagogique, "Programme", " pédagogique")
    
}

// load line from importation store
function loadEchantillonLine(index) {
    if(Array.isArray(_STORE.columns)) {
        loadValues( _STORE.datas[index]);
    } else {
        Object.keys(_STORE.columns).forEach(column => {
            loadValue(column, _STORE.datas[index][_STORE.columns[column]]);
            getElement("identification").value = createIdentification(index);
        });
    }
    getElement("rowNumber").innerText = 'Ligne : ' + index + ' sur ' + _STORE.datas.length ; 
};

function refreshCultures() {    
    head('refresh Cultures');
    showRpgInfos({
        cultures : toJson("cultures"),
        rpgReferences: rpgReferences           
    },  getElement("rpgTab"));
}

// Create new site from location tab
async function createSite() {
    	const temp = await postDatas(`${window.location.origin}/site`, {
            "nom": nomSite.value,
            "pays": pays.value,
            "region": region.value,
            "latitude": latitude.value,
            "longitude": longitude.value,
        });
		if (temp) {
            showModalOk("Site Créer");
            setSite();
            removeDisabled("next-2");
        }

}

// get information site
async function setSite() {
    head("setSite");
    const temp = await getDatas(`${window.location.origin}/sites/search/${site.value}`);
    if (temp) {
        if (temp.length === 1) {
            nomSite.value = temp[0].nom;
            site.value = temp[0].nom;
            pays.value = temp[0].pays;
            region.value = temp[0].region;
            latitude.value = temp[0].latitude;
            longitude.value = temp[0].longitude;
            setReadOnly(["nomSite", "pays", "region", "latitude","longitude"]);
            hideParentClass("btnAddSite",'form-group'); 
            removeDisabled("next-2");
            if (type.value.startsWith("Sol ")) {
                showParentClass("btnApiRpg",'form-group'); 
                refreshCultures();
                if ( _CONFIGURATION.passeport === true) setPasseport();
            } else hideParentClass("btnApiRpg",'form-group'); 
        }
    } else {
        // Create site
        nomSite.value = site.value;
        removeReadOnly(["nomSite", "pays", "region", "latitude","longitude"]);
        hideParentClass("btnApiRpg",'form-group'); 
        showParentClass("btnAddSite",'form-group');
        setDisabled("next-2");
     }

    
}

// start of echantillon
async function start() {
    if (_CONFIGURATION.debug === false) getElement("blockDemo").remove();
    _DATE = new Date();
    // get default sticker config 
    getElement("etiquette").value = JSON.stringify(_CONFIGURATION.etiquette);   
    // init select for sticker
    addToOption(getElement('element'), Object.keys(_CONFIGURATION.stickerElements));  
    // init select for stockage keys       
    addToOption(getElement('cle'), _CONFIGURATION.stockages);   
    // init select for etats keys       
    addToOption(getElement('etat'), _CONFIGURATION.etats, "Créer");
    // add demos if debug
    if(_CONFIGURATION.debug) addToOption(getElement('demos'), Object.keys(_DEMOS));   
    // set and get context
    const ctx = createContext();
    // action son mode
    if (ctx.mode === "id") {  // Edit mode
        // get echantillon with the API
        const datas = await getDatas(window.location.origin + "/echantillon/" + ctx.id);
        // rpg codes
        if (datas) {
            if (datas && datas.codes) {
                rpgReferences = JSON.parse(`{${datas.codes.join()}}`);
                delete datas.codes;
            }
            
            // load datas
            loadDatas(datas);
            updateReadOnly(ctx);
        }
        // change somes
        showParentClass('etat', 'form-group'); 
        hideParentClass( "btnApiRpg", "row-1");
        removeDisabled("btn-aliquote");
        getElement("btnApiRpg").innerText = "MAJ 🌍 RPG";
        changeTitle("Modification d'un échantillon");        
    } else if (ctx.mode === 'selection') { // Selection Edits mode
        // get selection from API
        const temp = await getDatas(window.location.origin + "/selection/" + ctx.id);
        _STORE = {
            datas: temp,
            columns: Object.keys(temp[0])
        }
        // read only on all columns
        setReadOnly(Object.keys(_STORE.datas[0]).filter(e => e !== "etat"));
        showParentClass("etat",'form-group'); 
        // get the range lines
        setRange();
        // Change title
        changeTitle("Modification de plusieurs échantillons");
        // Set the mode
    } else if (ctx.mode === 'excel') {  // Excel mode
        // get datas from API
        _STORE =  await getDatas(window.location.origin + "/excel/" + ctx.id);
        if(_STORE["datas"]) {
           etat.value = "Importé";
            // get the column selected in excel page
            let isEchantillon = false;
            Object.keys(_STORE.columns).forEach(column => {
                const elem = getElement(column);
                // If a column echantillon is found we use excel numerotation not automatic numerotation
                if (column === "echantillon") {
                    showParentClass("echantillon",'form-group');
                    isEchantillon = true;
                } 
                setReadOnly(column);
            });
            if (isEchantillon == false) {
                showParentClass("numero",'form-group'); 
                showParentClass("nombre",'form-group'); 
                setReadOnly("nombre");
                nombre.value = _STORE["datas"].length;
                echantillon.value = null;
            }
            // get the range lines
            setRange();
            changeTitle("Ajout depuis un fichier excel");
        }
        
    } else if (ctx.mode === 'after') {  // After mode        
        const temp = await getDatas(window.location.origin + "/echantillon/after/" + ctx.id);
        // get echantillon with the API
        const datas = await getDatas(window.location.origin + "/echantillon/" + ctx.id);
        // load datas
        loadDatas(datas);
        updateReadOnly(ctx);
        hideParentClass( "btnApiRpg", "form-group row-1 visible");
        getElement("numero").value = temp;
        getElement("numero").min = temp;
        multipleremoveInvisible(["numero",  "nombre"]); 
        removeReadOnly(["numero",  "nombre"]); 
        changeTitle("Ajout d'autres échantillon(s)");
    } else if (ctx.mode === 'aliquote') {  // child mode 
        const datas = await getDatas(window.location.origin + "/echantillon/" + ctx.id);
        console.log(datas);
        parent.value = datas.identification;
        loadDatas(datas);
        identification.value = createIdentification();
        updateReadOnly(ctx);
        hideParentClass( "btnApiRpg", "form-group row-1 visible");
        showParentClass( "parent", "form-group");
        // getElement("numero").value = temp;
        // getElement("numero").min = temp;
        multipleremoveInvisible(["numero",  "nombre"]); 
        removeReadOnly(["numero",  "nombre"]); 
        changeTitle("Création d'autres échantillon(s)");
    } else if (ctx.mode === 'new') { //  Default add mode
        multiplesetInvisible(["echantillon",  "etat"]); 
        multipleremoveInvisible(["numero",  "nombre"]); 
        getElement("etat").value = 'Créer';
        updateReadOnly(ctx);    
    } else log("Error mode");
    // init list
    refresh();
    refreshType();   
}

// start without await
start();