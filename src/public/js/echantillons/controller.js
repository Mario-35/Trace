// create identification with date time (without seconds) and echantillon number
function createIdentification(nb) {
    return `${ new Date(getElement("prelevement").value || new Date()).toLocaleDateString()}${new Date().toLocaleTimeString()}`.replace(/\D/g, "").slice(0,12) + (nb || getElement("echantillon").value || getElement("numero").value).padStart(4, '0');
}

function refreshType() {
    head('refresh Type');

    const names = [];
    for (var j = 0; j < getElement("type").options.length; j++) {
        if (getElement("type").options[j].value !== _AUCUN) 
        names.push(getElement("type").options[j].value.replace(/\s/g, '').toUpperCase());
    }
    const key = getElement("type").value.replace(/\s/g, '').toUpperCase();
    setVisible(names, key);

    
    switch (key) {
        case "SOLCULTIVÉ":
            refreshsolcultive();
            break;
        default:
            return;
    }
}

function refresh() {
    head('refresh');

    refreshType(); 
    
    // create identification
    if(!getElement("identification").value) {
        getElement("identification").value = createIdentification();
    }

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
                    <th style="width:10px">op</th> 
                </tr> 
            </thead> 
            <tbody> ${Object.keys(tmp).map((e,i) => `<tr><td>${e}</td><td>${tmp[e]}</td>
                    <td>
                        ${(i >= 0 && i < Object.keys(tmp).length - 1) ? `<a><i class="fas fa-arrow-down"></i></a>`:`&nbsp;`}
                        ${(i != 0 && i < Object.keys(tmp).length) ? `<a><i class="fas fa-arrow-up"></i></a>`:`&nbsp;`}
                        <a><i class="fas fa-trash"></i></a>
                    </td>
                </tr>`).join("")} 
            </tbody> 
        </table>` 
            : '';   
    } catch (error) {    
        log(error);
    } 

    if (getElement("etiquette").value) {
        const tmp = toJson("etiquette");
        Object.keys(tmp).forEach(e => {
            if (e !== "sticker0") {
                const elem = getElement(e);
                if (elem) {
                    elem.innerText = tmp[e].value ? tmp[e].value : ["prelevement","peremption"].includes(tmp[e].key) ? formatDate(getElement(tmp[e].key).value) : getElement(tmp[e].key).value || 'A definir';
                    elem.align = tmp[e].align;
                }
            }
        });
    }    
    
    if(_DEBUG === false) {
        hide("stockage");
        hide("etiquette");
        hide("cultures");
    }    
}

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

async function start() {
    if (_DEBUG === false) getElement("blockDemo").remove();
    _PASSPORT = undefined;
    _MODE = "none";
    // init id
    let id = 0;
    // get default sticker config 
    getElement("etiquette").value = JSON.stringify(_CONFIGURATION.etiquette);   
    getElement("stockage").value = JSON.stringify({});   
    getElement("cultures").value = JSON.stringify({});   
    // init select for sticker
    addToOption(getElement('element'), Object.keys(_CONFIGURATION.stickerElements));  
       
    addToOption(getElement('cle'), _CONFIGURATION.stockages);   
    addToOption(getElement('demos'), Object.keys(_DEMOS));   
    addToOption(getElement('etat'), _CONFIGURATION.etats, "Créer");        
    // if id in params get the id 
    if(isKeyInUrl('id'))
        id = getNumberFromUrl("id") ;
    // if id to load
    if(id > 0) {  // Edit mode
        // set id 
        document.getElementsByTagName("id").value = +id;
        // get echantillon with the API
        const datas = await getDatas(window.location.origin + "/echantillon/" + id);
        console.log(datas);
        if (datas.codes) {
            rpgReferences = JSON.parse(`{${datas.codes.join()}}`);
            delete datas.codes;
        }

        // load datas
        loadDatas(datas);
        //  change somes
        showParentClass("etat",'form-group'); 
        getElement("btn-creer").innerText = "Modifier";
        getElement("btnApiRpg").innerText = "MAJ données du RPG";
        setReadOnly([ "type", "prelevement", "pays", "region", "pointx", "pointy"]);
        hideParentClass( "btnApiRpg", "row-1");
        changeTitle("Modification d'un échantillon");
        _MODE = "edit";
        
    } else if (isKeyInUrl('selection')) { // Selection Edits mode
        id = getNumberFromUrl("selection") ;
        // get selection from API
        const temp = await getDatas(window.location.origin + "/selection/" + id);
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
        _MODE = "edits";
    } else if (isKeyInUrl('excel')) {  // Excel mode
        id = getNumberFromUrl("excel"); 
        // get datas from API
        _STORE =  await getDatas(window.location.origin + "/excel/" + id);
        if(_STORE["datas"]) {
           showParentClass("etat",'form-group'); 
            // get the column selected in excel page
            let isEchantillon = false;
            Object.keys(_STORE.columns).forEach(column => {
                const elem = getElement(column);
                // If a column echantillon is found we use excel numerotation not automatic numerotation
                if (column === "echantillon") {
                    getElement("numero").readOnly = true;
                    showParentClass("echantillon",'form-group'); 

                    isEchantillon = true;
                }
                // set column readonly
                elem.readOnly = true;
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
            _MODE = "news";
        }
        
    } else if (isKeyInUrl('after')) {  // After mode
        const tmpId = getNumberFromUrl("after"); 
        const temp = await getDatas(window.location.origin + "/echantillon/after/" + tmpId);
        document.getElementsByTagName("id").value = 0;
        // get echantillon with the API
        const datas = await getDatas(window.location.origin + "/echantillon/" + tmpId);
        // load datas
        loadDatas(datas);
        //  change somes
        showParentClass("etat",'form-group'); 
        getElement("btn-creer").innerText = "Ajouter";
        setReadOnly([ "type", "programme", "site", "responsable", "prelevement", "pays", "region", "pointx", "pointy", "numero"]);
        hideParentClass( "btnApiRpg", "row-1");
        multipleHide(["echantillon",  "etat"]); 
        multipleShow(["numero",  "nombre"]); 
        getElement("etat").value = 'Créer';
        getElement("numero").value = temp;
        changeTitle("Ajout d'échantillon(s)");
        _MODE = "add";
    } else { //  // Default add mode
        multipleHide(["echantillon",  "etat"]); 
        multipleShow(["numero",  "nombre"]); 
        getElement("etat").value = 'Créer';
        _MODE = "new";
    }

    if (_MODE === "none") log("Error _MODE)")
    refresh();
}

// start without await
start();