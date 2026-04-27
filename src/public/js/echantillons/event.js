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
    } else if (isContextMode(["excel", "new", "after", "aliquote","selectionaliquote"])) {
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
        if (temp) numero.value = temp;
};

function updateIdentification() {
   getElement("identification").value = createIdentification();
};

function cleanCulture() {
   getElement("cultures").value= JSON.stringify({});
   
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

// Button de demo
getElement('demos').addEventListener('change', (event) => {
    event.preventDefault();
    loadValues(_DEMOS[getElement("demos").value]);
    refresh();
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

getElement("nombreOuAnalyses").addEventListener("change", (event) => {
    event.preventDefault();
    readOnly(event.target.checked, "nombre");
    showModalEditingList(" Chaque analyse générera un échantillon", "ajouter une analyse", getElement("analyses"), function() {nombre.value = getElement("analyses").value.split(',').length });  
});

getElement("pedagogique").addEventListener("change", (event) => {
    event.preventDefault();
    refresh();
});
getElement("etat").addEventListener("change", (event) => {
    modifiedValue("etat");
});
