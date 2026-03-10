getElement('btn-creer').addEventListener('click', async function() {
    _DATAS = formDatas();
    const ctx = getContext();
    if (validateSite() === true) {
        if (ctx.mode ==="id") {
            fetch(window.location.origin + `/site/` + ctx.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(_DATAS),
            }).then(async response => {
                const resJson =  await response.json();
                if (response.status === 201) {
                    showModalOk("Opération réussie", window.location.origin + "/sites.html");
                } else {
                    showModalError(resJson.code + " : " + resJson.error);
                }
            }).catch(err => {
                showModalError(err);
            });
        } else if (ctx.mode === "new") {
            fetch(window.location.origin + `/site`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(_DATAS),
            }).then(async response => {
                const resJson =  await response.json();
                if (response.status === 201) {
                    showModalOk("Opération réussie", "./sites.html");
                } else {
                    showModalError(resJson.code + " : " + resJson.error);
                }
            }).catch(err => {
                showModalError(err);
            });
        } else {
            alert(_NOTYET);
        }
    }
});

getElement('btn-annuler').addEventListener('click', function() {
    window.location.href = window.location.origin + "/sites.html";
});

//  button d'interrogation du rpg
getElement('btnApiRpg').addEventListener('click', async function() {
    await getRpgInfos(getElement("rpgTab"));
    setInvisible("btnApiRpg");
});

function removeRpgInfos() {
    getElement("rpgTab").innerHTML = "";
    removeInvisible("btnApiRpg");
}

// latitude change
getElement("latitude").addEventListener("change", function() {
    removeRpgInfos();
});

// longitude change
getElement("longitude").addEventListener("change", function() {
   removeRpgInfos();
});