getElement('btn-creer').addEventListener('click', async function() {
    _DATAS = formDatas();
    const ctx = getContext();
    if(validatePasseport() === true) {
        if (ctx.mode === "new") {
            var input = document.querySelector('input[type="file"]');
            if (input.files[0]) {
                const formData = new FormData();
                formData.append('image', input.files[0]);
                const addFile = await fetch(window.location.origin + `/upload`, {
                    method: "POST",
                    body: formData,
                });
                const res = await addFile.json();   
                _DATAS["fichier"] = res.id;
            } else _DATAS["fichier"] = 0;
            fetch(window.location.origin + `/passeport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(_DATAS),
            }).then(async response => {
                const resJson =  await response.json();
                if (response.status === 201) {
                    showModalOk("Opération réussie", "./passeports.html");
                } else {
                    showModalError(resJson.code + " : " + resJson.error);
                }
            }).catch(err => {
                showModalError(err);
            });
        }
    }
});

getElement('demo').addEventListener('click', function() {
    document.getElementById("nom").value = 'Parcelle de chez moi 2026';
    document.getElementById("annee").value  = '2026';
    document.getElementById("tracabilite").value = '16';
    document.getElementById("origine").value = "FR";
    refresh();
});