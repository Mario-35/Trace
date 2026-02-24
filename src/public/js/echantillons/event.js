//  button création 
getElement('btn-creer').addEventListener('click', async function() {
    head(" btn-creer");
    
    _DATAS = formToJSON(document.getElementsByClassName('formData')[0].elements); 
    if(window.location.href.includes('?id=')) {
        const id = window.location.href.split('?id=')[1];
        fetch(window.location.origin + `/echantillon/` + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDatas()),
        }).then(async response => {
            if (response.status === 201) {
                showModalPrint(id, getElement("passeport").value);
            } else {
                const resJson =  await response.json();
                showModalError(resJson);
            }
        }).catch(err => {
            showModalError(err);
        });
    } else {
        if (window.location.href.includes('?excel=')) 
            _DATAS["excel"] = +window.location.href.split('?excel=')[1] || 0;
        
        fetch(window.location.origin + `/echantillon`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(_DATAS),
        }).then(async response => {
            if (response.status === 201) {
                const data = await response.json();
                console.log(data);
                if (data.identification )
                    showModalPrint(data.identification, getElement("passeport").value, true);
                else showModalError("Aucun retour reçu");
            } else {
                const resJson =  await response.json();
                showModalError(resJson.code + " : " + resJson.error);
            }
        }).catch(err => {
            showModalError(err);
        });
    }
});

//  button d'interrogation du rpg
getElement('btnApiRpg').addEventListener('click', async function() {
    if (getElement("pointx").value && getElement("pointy").value)  {
        pointx.value = pointx.value.replace(',','.');
        pointy.value = pointy.value.replace(',','.');
        const temp = await getDatas(window.location.origin + '/rpg?pos=' + pointx.value + "," + pointy.value);
        rpgReferences = JSON.parse(`{${temp.codes.join()}}`);
        getElement("cultures").value= JSON.stringify(temp.values);
    }
    refresh();
});

// changement de la cle de stockage
getElement('cle').addEventListener('change', function() {
    valeur.value = toJson("stockage")[this.value] || '';
});

// changement de la valeur de stockage
getElement("valeur").addEventListener("blur", function() {
    addToJson ("stockage", cle.value, valeur.value);
    refresh();
});

// modification de la date de prelevement
getElement('prelevement').addEventListener('change', function() {
   getElement("identification").value = createIdentification();
});

// modification du numéro
getElement('numero').addEventListener('change', function() {
   getElement("identification").value = createIdentification();
});

// Button de demo
getElement('demos').addEventListener('change', function() {
    loadValues(_DEMOS[getElement("demos").value]);
    refresh();
});

getElement("type").addEventListener("change", function() {
    getElement("cultures").value= JSON.stringify({});
    refreshType();
});
getElement("pointx").addEventListener("change", function() {
    getElement("cultures").value= JSON.stringify({});
});

getElement("pointy").addEventListener("change", function() {
    getElement("cultures").value= JSON.stringify({});
});

getElement("searchSite").addEventListener("keyup", async function() {
    getElement('sitesData').innerHTML = "";
     const temp = await getDatas(`${window.location.origin}/sites/search/${searchSite.value}`);
     if (temp) 
         addToOption(getElement('sitesData'), temp);
});