// create identification with date time (without seconds) and echantillon number
function createIdentification(nb) {
    if (isContextMode(['new',"aliquote","excelaliquote","excel","selectionaliquote"])) {
        if(!_DATE) _DATE = new Date();
        creation.value = _DATE.toLocaleString();
        return `${ _DATE.toLocaleDateString()}${ _DATE.toLocaleTimeString()}`.replace(/\D/g, "").slice(0,12) + (nb || getElement("numero").value ||  getElement("echantillon").value).padStart(4, '0');
    }
};

// refresh type that fixe mask
function refreshType() {
    const names = [];
    for (var j = 0; j < getElement("type").options.length; j++) {
        if (getElement("type").options[j].value !== _AUCUN) 
        names.push(getElement("type").options[j].value.replace(/\s/g, '').toUpperCase());
    }
    const key = getElement("type").value.replace(/\s/g, '').toUpperCase();
    setVisible(names, key);
};

function valueIfChecked(element, elementTest, text, textChecked) {
    element.innerText = `${text}${elementTest.checked ? ` ${textChecked}` : ""}`
};

// Refresh screen information
function refresh() {
    head('refresh');  
    // create identification
    if(!identification.value) {
        identification.value = createIdentification();
    }
    // peremption date
    if(!getElement("peremption").value) { 
        if(getElement("prelevement").value) { 
            const dates = getElement("prelevement").value.split("-");
            getElement("peremption").value = `${+dates[0] + 5}-${dates[1]}-${dates[2]}`;
        }
    }
    
    if(_CONFIGURATION.debug === false) {
        setInvisible("stockage");
        setInvisible("etiquette");
        setInvisible("cultures");
    }  
    
    // valueIfChecked(pedagogique.nextSibling.nextSibling, pedagogique, "Programme", " pédagogique")
    
};


function refreshCultures() {    
    head('refresh Cultures');
    showRpgInfos({
        cultures : toJson("cultures"),
        rpgReferences: rpgReferences           
    },  getElement("rpgTab"));
};

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

};

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
        removeReadOnly(["nomSite", "pays", "region", "latitude", "longitude"]);
        hideParentClass("btnApiRpg",'form-group'); 
        showParentClass("btnAddSite",'form-group');
        setDisabled("next-2");
     }

    
};

async function showAliquote(input) {
    // loadDatas(datas);
    if (input)
        getElement("parent").value = input.identification;
    updateReadOnly(ctx);
    hideParentClass( "btnApiRpg", "form-group row-1 visible");
    showParentClass( "parent", "form-group");
    multipleremoveInvisible(["numero",  "nombre", "btn-analyses", "btn-libre"]); 
    removeReadOnly(["nombre","numero","libre","analyses","condition","responsable"]); 
    identification.value = createIdentification();
}

function restoreDatas() {
    const datas = JSON.parse(localStorage.getItem('_DATAS'));    
    if (datas) {
        Object.keys(datas).forEach(e => {
            loadValue(e, datas[e]);
        });
        localStorage.removeItem('_DATAS');
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
    // addToOption(getElement('cle'), _CONFIGURATION.stockages);   
    // init select for etats keys       
    addToOption(getElement('etat'), _CONFIGURATION.etats, "Créer");
    addToOption(getElement('type'), _CONFIGURATION.types, _AUCUN);
    addToOption(getElement('caracterisation'), _CONFIGURATION.caracterisations, _AUCUN);
    addToOption(getElement('textSize'), _CONFIGURATION.sizes, "10px");
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
        if (!["Créer", "Importer"].includes(datas.etat)) removeDisabled("btn-aliquote");
        setElementText("btnApiRpg", "MAJ 🌍 RPG");
        setElementText("formTitle", "Modification d'un échantillon");         
        parentClass( "parent", "form-group", datas.parent !== null) ;

        new editingList(getElement("stockageList"), "Mots clés pour le stockage", "Ajouter une clé", datas.stockage, _CONFIGURATION["stockages"]);  
              
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
        if (!["Créer", "Importer"].includes(_STORE.datas[0].etat)) removeDisabled("btn-aliquote");
        // get the range lines
        setRange();
        // Change title
        setElementText("formTitle", "Modification de " + String(_STORE.datas.length) + " échantillons");
        // Set the mode
    } else if (ctx.mode === 'excel' || ctx.mode === "excelaliquote") {  // Excel mode
        // get datas from API
        _STORE =  await getDatas(window.location.origin + "/excel/" + ctx.id);
        if(_STORE["datas"]) {
            this.restoreDatas();
            etat.value = "Importé";
            // get the column selected in excel page
            if (ctx.mode === "excelaliquote") {
                showAliquote();
                identification.value = createIdentification();
                setReadOnly("nombre");
                setInvisible("btn-libre");
                setInvisible("btn-analyses");
                setElementText("formTitle", "Création d'autres échantillon(s) depuis un fichier excel");                
            } else setElementText("formTitle", "Ajout depuis un fichier excel");
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
            // get the range lines
            if (isEchantillon == false) {
                showParentClass("numero",'form-group'); 
                showParentClass("nombre",'form-group'); 
                setReadOnly("nombre");
                nombre.value = _STORE["datas"].length;
                echantillon.value = null;
            }
            setRange();
        }
        
    } else if (ctx.mode === 'after') {  // After mode        
        const temp = await getDatas(window.location.origin + "/echantillon/after/identification/" + ctx.id);
        // get echantillon with the API
        const datas = await getDatas(window.location.origin + "/echantillon/" + ctx.id);
        // load datas
        loadDatas(datas);
        updateReadOnly(ctx);
        hideParentClass( "btnApiRpg", "form-group row-1 visible");
        getElement("numero").value = temp.max;
        getElement("numero").min = temp.max;
        multipleremoveInvisible(["numero",  "nombre"]); 
        removeReadOnly(["numero",  "nombre"]); 
        setElementText("formTitle", "Ajout d'autres échantillon(s)");
    } else if (ctx.mode === 'aliquote') {  // child mode 
        const datas = await getDatas(window.location.origin + "/echantillon/" + ctx.id);
        loadDatas(datas);
        showAliquote(datas);
        setElementText("formTitle", "Création d'autres échantillon(s)");
    } else if (ctx.mode === 'selectionaliquote') {  // child mode 
        // get selection from API
        const temp2 = await getDatas(window.location.origin + "/selection/" + ctx.id);
        _STORE = {
            datas: temp2,
            columns: Object.keys(temp2[0])
        }
        // read only on all columns
        setReadOnly(Object.keys(_STORE.datas[0]).filter(e => e !== "etat"));
        // get the range lines
        setRange();

        await showAliquote( _STORE.datas[0]);
        setElementText("formTitle", "Création d'autres échantillon(s) à partir de " + String(_STORE.datas.length) + " échantillons");
    } else if (ctx.mode === 'new') { //  Default add mode
        multiplesetInvisible(["echantillon",  "etat"]); 
        multipleremoveInvisible(["numero",  "nombre", "btn-analyses", "btn-libre"]); 
        getElement("etat").value = 'Créer';
        updateReadOnly(ctx);        

        new editingList(getElement("stockageList"), "Mots clés pour le stockage", "Ajouter une clé", {}, _CONFIGURATION["stockages"]);  

    } else log("Error mode");
    // init list
    refresh();
    refreshType();   
};

function setMin(element, min) {
        element.min = min;
        
        if (element.value < min)
            element.value = min;
};

async function createExcelFromList(element) {    
    if (element.getAttribute("list") !== "") {
        const name = element.name
        const obj = [];
        element.getAttribute("list").split(',').forEach(e => {
            obj.push({ [`${name}`]: e});        
        });
        const response = await fetch(window.location.origin + `/excel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "datas": obj, "columns": { [`${name}`]: name }}),
        });		
        const res = await response.text();
        localStorage.setItem('_DATAS', JSON.stringify(formDatas()));
        window.location.href = `./echantillon-add.html?excel${getContext().mode === 'aliquote' ? "aliquote=" : "="}${JSON.parse(res)[0].id}`;
    }
}

// start without await
start();