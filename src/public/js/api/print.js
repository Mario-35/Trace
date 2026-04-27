
function createSticker(name, stick, value) {
    const element = document.createElement('div');
    element.className = name;
    element.id=name;
    element.innerText = value;
    stick.align = stick.align || "center";
    stick.size = stick.size || '12px';
    element.style =  'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: ' + stick.align + '; font-size: ' + stick.size + ';';
    return element;
}

function genrateBarCode(element, data) {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, data, {
        format: "CODE128",
        width: 1,
        height: 50,
        fontSize: 16,
        flat: true,
        diplayvalue: true
    });
    element.appendChild(canvas);
}

function createEtiquette(element, values) {
    // special combo
    if (values["dossier"] && values["identification"])    
     values["dossier-numero"] = String(values["dossier"]).padStart(4, '0') + '-' + values["identification"].slice(-4);
    // for passeport to have inormation on trace 
    const isPassport = +values["passeport"] > 0;
    if(isPassport) values["passeport"] = `${values["prelevement"].slice(0, 4)}-${String(values["passeport"]).padStart(4, "0")}`;        

    const vals = JSON.parse(JSON.stringify(values.etiquette));
    const etiquette =  document.createElement('div');
    etiquette.className = "sticker";
    const CB =  document.createElement('div');
    CB.className = "sticker0 barcode";
    genrateBarCode(CB, values[vals.sticker0.key] , 25 )
    etiquette.appendChild(CB);
    const rightCB = document.createElement('div');
    rightCB.className = "rightCB";
    rightCB.innerHTML = `
    <table style="  width: 100%; height: 100%; border-collapse: collapse; border-spacing: 0;">
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr><td class="dateLabel">Prelevement</td></tr>
            <tr><td class="date">${formatDate(values["prelevement"])}</td></tr>
            <tr><td class="dateLabel">Peremption</td></tr>
            <tr><td class="date">${formatDate(values["peremption"])}</td></tr>
    </table>`;
    etiquette.appendChild(rightCB);      
    Object.keys(vals).filter(e => e != "sticker0").forEach(stick => {
        const key = vals[stick].key;        
        if (key)
            etiquette.appendChild(createSticker(stick === "sticker2" && isPassport ? "stickerPasseport": stick, vals[stick], values[key]));    
        else if (vals[stick].value)     
            etiquette.appendChild(createSticker(stick === "sticker2" && isPassport ? "stickerPasseport": stick, vals[stick], vals[stick].value));    
    });
    element.appendChild(etiquette);
};

function createPasseport(element, values) {
    const etiquette =  document.createElement('div');
    etiquette.className = "pass-phyto";
    etiquette.innerHTML = `
    <div class="head"></div>
    <div class="flag" id="passeportFlag"><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 356.18"><path fill="#039" fill-rule="nonzero" d="M28.137 0H483.86C499.337 0 512 12.663 512 28.14v299.9c0 15.477-12.663 28.14-28.14 28.14H28.137C12.663 356.18 0 343.517 0 328.04V28.14C0 12.663 12.663 0 28.137 0z"/><path fill="#FC0" d="M237.179 53.246h14.378L256 39.572l4.443 13.674h14.378l-11.633 8.451 4.444 13.673L256 66.919l-11.632 8.451 4.444-13.673-11.633-8.451zm0 237.458h14.378L256 277.03l4.443 13.674h14.378l-11.633 8.451 4.444 13.673L256 304.377l-11.632 8.451 4.444-13.673-11.633-8.451zM118.45 171.975h14.378l4.443-13.674 4.443 13.674h14.378l-11.633 8.451 4.443 13.673-11.631-8.451-11.632 8.451 4.444-13.673-11.633-8.451zm59.363-102.796h14.377l4.443-13.674 4.443 13.674h14.378l-11.632 8.451 4.443 13.674-11.632-8.451-11.632 8.451 4.443-13.674-11.631-8.451zm-43.429 43.429h14.378l4.442-13.673 4.444 13.673h14.377l-11.632 8.451 4.443 13.674-11.632-8.451-11.631 8.451 4.443-13.674-11.632-8.451zm-.032 118.737h14.377l4.443-13.674 4.443 13.674h14.377l-11.631 8.451 4.443 13.674-11.632-8.451-11.632 8.451 4.443-13.674-11.631-8.451zm43.471 43.46h14.378l4.443-13.674 4.443 13.674h14.378l-11.632 8.451 4.443 13.674-11.632-8.451-11.631 8.451 4.443-13.674-11.633-8.451zm178.085-102.83h14.378l4.443-13.674 4.443 13.674h14.378l-11.633 8.451 4.444 13.673-11.632-8.451-11.631 8.451 4.443-13.673-11.633-8.451zM296.546 69.179h14.378l4.443-13.674 4.443 13.674h14.377l-11.631 8.451 4.443 13.674-11.632-8.451-11.632 8.451 4.443-13.674-11.632-8.451zm43.429 43.429h14.377l4.444-13.673 4.442 13.673h14.378l-11.632 8.451 4.443 13.674-11.631-8.451-11.632 8.451 4.443-13.674-11.632-8.451zm.033 118.737h14.377l4.443-13.674 4.443 13.674h14.377l-11.631 8.451 4.443 13.674-11.632-8.451-11.632 8.451 4.443-13.674-11.631-8.451zm-43.473 43.46h14.378l4.443-13.674 4.443 13.674h14.378l-11.633 8.451 4.443 13.674-11.631-8.451-11.632 8.451 4.443-13.674-11.632-8.451z"/></svg></div>
    <div class="title" id="passeportTitle" align="right"><p>Passeport phytosanitaire - ZP / Plant passport - PZ<br
    >Beet necrotic yellow vein virus</p></div>
    <div class="nom" id="passeportNom"><p><b>A</b> Sol</p></div>
    <div class="code" id="passeportCode"><p><b>B</b> ${values.code}-${values.identifiant}</p></div>
    <div class="trace" id="passeportTracabilite"><p><b>C</b> ${values.annee}-${String(values.tracabilite).padStart(4, '0')}</p></div>
    <div class="origine" id="passeportOrigine"><p><b>D</b> ${values.origine}</p></div>`;
    element.appendChild(etiquette);
};

function start() {
    const printAble =  document.createElement('div');
    printAble.id = "printAble";
    // printAble.style = `margin: 1px; width: ${_CONFIGURATION.print.width}; height: ${_CONFIGURATION.print.height}`;

    if (document.getElementById("passeportsContent")) {
        document.getElementById("passeportsContent").appendChild(printAble);
        Object.values(_DATAPI).forEach(e => createPasseport(printAble, e));
    } else if (document.getElementById("echantillonsContent")) {
        document.getElementById("echantillonsContent").appendChild(printAble);
        Object.values(_DATAPI).forEach(e => createEtiquette(printAble, e));
    }
    window.addEventListener("afterprint", (event) => {
        window.close();
    });
    if (_CONFIGURATION.debug === false) window.print();
}
