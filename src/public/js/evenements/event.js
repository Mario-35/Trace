getElement('btn-creer').addEventListener('click', async function() {
    _DATAS = formDatas();
    const ctx = getContext();
    if (validateSite() === true) {
            fetch(window.location.origin + `/evenement`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(_DATAS),
            }).then(async response => {
                const resJson =  await response.json();
                if (response.status === 201) {
                    showModalOk("Opération réussie", "./evenements.html");
                } else {
                    showModalError(resJson.code + " : " + resJson.error);
                }
            }).catch(err => {
                showModalError(err);
            });
        // } else {
        //     alert(_NOTYET);
        // }
    }
});

getElement('btn-annuler').addEventListener('click', function() {
    window.location.href = window.location.origin + "/evenements.html";
});

