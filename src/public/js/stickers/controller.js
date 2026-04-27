// Fonction de selection d'element d'étiquette
function selectElement(name) {
    const tmp = toJson("etiquette")[name];
    getElement("element").value = tmp.key;
    getElement("texte").value = tmp.value || "";
    getElement("elementLabel").innerText = name;
    getElement("textAlign").value = tmp.align || "center";  
    getElement("textSize").value = tmp.size || "12px";   
    multiRemoveDisabled(["element", "elementLabel", "texte", "textAlign", "textSize"]);
};

function sticker_start(values) {
    // create gabarit
    createEtiquette(getElement("gabaritEtiquette"), getTemplateSticker(values));
    // disabled formats
    multiSetDisabled(["element", "elementLabel", 'texte', "textAlign", "textSize"]);
    // create events
    for (let i = 1; i < Object.keys(_CONFIGURATION.etiquette).length; i++) 
        if (getElement('sticker' + i))
            getElement('sticker' + i).addEventListener('click', function() { selectElement("sticker" + i) });

    // Action de changement de la séléction d'un élément d'étiquette
    getElement('element').addEventListener("change", function(event) {
        event.preventDefault();
        changeValueInJson("etiquette", [getElement("elementLabel").innerText, "key"], getElement("element").value);
        if (document.title === "Configuration") 
            getElement(getElement("elementLabel").innerText).innerText = _CONFIGURATION.stickerElements[getElement("element").value];
        else 
            getElement(getElement("elementLabel").innerText).innerText = getElement(getElement("element").value).value;
        modifiedValue("etiquette");
    });

    // Align select change
    getElement('textAlign').addEventListener('change', function() {
        changeValueInJson("etiquette", [getElement("elementLabel").innerText, "align"], textAlign.value);
        getElement(getElement("elementLabel").innerText).style["text-align"] = textAlign.value;
        modifiedValue("etiquette");
    });

    // size text select change
    getElement('textSize').addEventListener('change', function() {
        changeValueInJson("etiquette", [getElement("elementLabel").innerText, "size"], textSize.value);
        getElement(getElement("elementLabel").innerText).style.fontSize = textSize.value;
        modifiedValue("etiquette");
    })

    // changement de texte libre
    getElement("texte").addEventListener("blur", function(event) {
        event.preventDefault();
        const tmp = toJson("etiquette");
        modifiedValue("etiquette");
        if (texte.value.trim() === "") {
        delete tmp[getElement("elementLabel").innerText].value ;
        tmp[getElement("elementLabel").innerText].key =  getElement("element").value;
        tmp[getElement("elementLabel").innerText].value = getElement("element").value;
        return;
        };   
        tmp[getElement("elementLabel").innerText].key = null;
        tmp[getElement("elementLabel").innerText].value = getElement("texte").value;
        getElement(getElement("elementLabel").innerText).innerText = getElement("texte").value;
        getElement("etiquette").value = JSON.stringify(tmp);
    });

    // bounton impression d'étiquette
    if (getElement("testPrintEtiquette"))
        getElement("testPrintEtiquette").addEventListener("click", async function(event) {
            event.preventDefault();
            await fetch(window.location.origin + `/SaveConfig`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(getTemplateSticker(values)),
            }).then(async response => {
                if (response.status === 201) {
                    if (temp) open(window.location.origin + '/print/' + "echantillon", "Imprimer", _PARAMPRINT);
                }
            });
        });
}