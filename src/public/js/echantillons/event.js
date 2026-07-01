//  button création 
getElement('btn-creer').addEventListener('click', async (event) => {
    event.preventDefault();    
    _DATAS = formDatas();
    
    const ctx = getContext();
    if (isContextMode(["id", "selection"])) {
        fetch(window.location.origin + `/echantillon${isContextMode(["selection"]) ? 's/selection' :''}/` + ctx.id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filterModified(_DATAS)),
        }).then(async response => {
            const resJson =  await response.json();
            console.log(resJson);
            
            if (response.status === 201) {                      
                if (isChrome) 
                    showModalPrint(isContextMode(["id"]) ? {echantillon: +ctx.id} : {selection: +ctx.id});
            } else {
                showModalError(resJson.error);
            }
        }).catch(err => {
            showModalError(err);
        });
    } else if (isContextMode(["excel", "new", "after","excelaliquote", "aliquote", "selectionaliquote"])) {
        _DATAS["etat"] = "Créer";
        fetch(window.location.origin + `/echantillon`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(_DATAS),
        }).then(async response => {
            const resJson =  await response.json();
            if (response.status === 201) {
               if (resJson)
                    if (isChrome) 
                        showModalPrint(resJson);
                else showModalError("Aucun retour reçu");
            } else {
                showModalError(resJson.code + " : " + resJson.error);
            }
        }).catch(err => {
            showModalError(err);
        });       
    } else alert(_NOTYET);
    // window.history.back();
});

getElement('btn-aliquote').addEventListener('click', async (event) => {
    event.preventDefault();   
    window.location.href = window.location.origin + `/echantillon-add.html?${isContextMode(["selection"]) ? 'selectionaliquote=' : 'aliquote='}` + ctx.value;
});


async function getMaxNombre() {
        const temp = await getDatas(window.location.origin + '/echantillon/next/' + createIdentification());
        numero.min = temp;
        if (temp) 
            setElementValue(numero, temp);
};

function updateIdentification() {
   setElementValue("identification", createIdentification());
};

function cleanCulture() {
   setElementValue("cultures", JSON.stringify({}));   
};

//  button d'interrogation du rpg
getElement('btnApiRpg').addEventListener('click', async (event) => {
    event.preventDefault();
    await getRpgInfos(getElement("rpgTab"));
    refresh();
});

getElement('btnAddSite').addEventListener('click', async (event) => {
    event.preventDefault();
    setDisabled("btnAddSite");
    await createSite();
    refresh();
});

// changement de la cle de stockage
getElement('site').addEventListener('blur', async (event) => {
    event.preventDefault();
    if(site.value.trim().length > 2) {
        const datas = await getDatas(`${window.location.origin}/sites/filter/${site.value}`);
        addDataList(getElement('site'), datas); 
    }
});

// modification de la date de prelevement
getElement('prelevement').addEventListener('change', (event) => {
    event.preventDefault();
   updateIdentification();
});

// modification du numéro
getElement('numero').addEventListener('change', (event) => {
    event.preventDefault();
   updateIdentification();
});

// Select type
getElement("type").addEventListener("change", (event) => {
    event.preventDefault();
    cleanCulture();
});

// latitude change
getElement("latitude").addEventListener("change", (event) => {
    event.preventDefault();
    cleanCulture();
});

// longitude change
getElement("longitude").addEventListener("change", (event) => {
    event.preventDefault();
   cleanCulture();
});

// getElement("nombreOuAnalyses").addEventListener("change", (event) => {
//     event.preventDefault();
//     readOnly(event.target.checked, "nombre");
//     showModalEditingList("Chaque analyse générera un échantillon", 
//                         "ajouter une analyse", 
//                         getElement("analyses"),
//                         function() {nombre.value = getElement("analyses").value.split(',').length });  
// });

getElement("etat").addEventListener("change", (event) => {
    modifiedValue("etat");
});

getElement("caracterisation").addEventListener("change", (event) => {
    modifiedValue("caracterisation");
});

getElement("btn-libre").addEventListener("click", (event) => {
    event.preventDefault();
    showModalEditingList("Liste des libéllés libre", 
                        "ajouter un libéllé", 
                        getElement("libre"), 
                        function() { createExcelFromList(getElement("libre")); });  
});

getElement("btn-analyses").addEventListener("click", (event) => {
    event.preventDefault();
    showModalEditingList("Liste des analyses", 
                        "ajouter une analyse", 
                        getElement("analyses"), 
                        function() { createExcelFromList(getElement("analyses")); });  
});

function fillDatas(input) {
    Object.keys(input).forEach(key => {
        if (key === "numero") {
            const elem = getElement("numero");
            elem.value = +input[key]+ 1;
            elem.min = +input[key]+ 1;
            updateIdentification();
        } else if (key === "etiquette") {
            setElementValue(key, JSON.stringify(input[key]));
        } else setIfNull(key, input[key]);
    });
};

// chargement d'infos à partir du nom de programme
getElement('programme').addEventListener('blur', async (event) => {
    event.preventDefault();
    if(programme.value.trim() !== "") {
        try {
            let temp = await getDatas(window.location.origin + `/programme?nom='${programme.value.toUpperCase()}'`);
            fillDatas(temp);
        } catch (error) {
            showModalError(error);
        }
    }    
});

// chargement d'infos à partir du numero de dossier
getElement('dossier').addEventListener('blur', async (event) => {
    event.preventDefault();
    if(dossier.value.trim() !== "") {
        try {
            let temp = await getDatas(window.location.origin + `/programme?dossier='${dossier.value.toUpperCase()}'`);
            if (temp)
                fillDatas(temp);
        } catch (error) {
            log(error);
            showModalError(error);
        }
    }    
});