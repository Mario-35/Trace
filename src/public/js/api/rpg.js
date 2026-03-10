async function getRpg(latitude, longitude) {
    const temp = await getDatas(window.location.origin + '/rpg?pos=' + longitude.replace(',','.') + "," + latitude.replace(',','.'));
    return {
        cultures : temp.values,
        rpgReferences: JSON.parse(`{${temp.codes.join()}}`)            
    }
}

codeRisque = (input, risques, possibles) => {
    let result = undefined;
    if(input.cultures) {
        const vals = Object.values(input.cultures).filter(e => ![ "","NOT"].includes(e.trim()));
        if (vals.length < 1) return { niveau: 0}; 
        risques.forEach(e => {
            if (vals.includes(e)) result = {
                niveau: 3,
                culture: input.rpgReferences[e]
            };
        });
        if (result) return result;
        possibles.forEach(e => {
            if (vals.includes(e)) result = {
                niveau: 2,
                culture: input.rpgReferences[e]
            };
        });
        if (result) return result;
        return { niveau: 1}; 
    }
    return { niveau: -1};  
}

// element is the button that ask rpg
async function getRpgInfos(element) {
    const input = await getRpg(latitude.value, longitude.value);
    showRpgInfos(input, element);
}

function showRpgInfos(input, element) {
    let btn = '';
    if (getElement("latitude").value && getElement("longitude").value)  {
        const countCultures = Object.keys(input.cultures).length;
        if (countCultures > 0 ) {
            const test = codeRisque(input, ["BTN","BVF"],["16","24"]);
            
            if(getElement("risqueRpg")) risqueRpg.value = +test.niveau || -1 ;
            if(getElement("cultures")) getElement("cultures").value= JSON.stringify(input.cultures);

            if(_CONFIGURATION.passeport === true && region.value.toUpperCase() !== _CONFIGURATION.region.toUpperCase()) 
                btn = (test.niveau !== -1 || (test.niveau > 1 && (_CONFIGURATION.autoTest && _CONFIGURATION.autoTest === true) )) ? `
                <tr id="btn-passeport">
                    <td colspan="${countCultures}" center>
                        <div class="container-center">
                            <div class="btn-group">
                                <button class="btn btn-passeport" id="btn-passeport-create">
                                        Créer un passeport phytosanitaire${(+test.niveau > 1) ? ' avec test' : ''} pour ${_YEAR}
                                </button>
                            </div> 
                        </div>
                    </td>
                </tr> `
                : '';

            rpgReferences = input.rpgReferences;
                element.innerHTML = input.cultures  
                ? `<table class="table table-year"> 
                        <thead>
                            <tr> 
                                ${Object.keys(input.cultures).map((e) => `<th>&nbsp;${e}&nbsp;</th>`).join("")}
                            </tr> 
                        </thead> 
                        <tbody> 
                            <tr>
                                ${Object.values(input.cultures).map((e) => `<td title="${input.rpgReferences[e]}">${e}</td>`).join("")} 
                            </tr> 
                        </tbody> 
                        ${
                            _CONFIGURATION.passeport === true ?
                            `<tfooter>
                                <tr>
                                    <td colspan="${countCultures}" center>
                                        <div class="messageRpg"> 
                                            <p class="text-primary" id="message"></p> 
                                        </div>
                                    </td>
                                </tr>
                                ${getElement("passeport") && +(getElement("passeport").value) > 0 ? '' : btn}
                            </tfooter>` : ''
                        }
                    </table>` 
                : '';
            if(_CONFIGURATION.passeport === true) {
                const lastYear = Object.keys(input.cultures).filter(e => input.cultures[e] !== 'NOT').map(e => +e).reverse()[0];
                const elem = getElement("message");
                if (pays.value.toUpperCase() !== _CONFIGURATION.pays.toUpperCase() || region.value.toUpperCase() !== _CONFIGURATION.region.toUpperCase()) {
                    switch (test.niveau) {
                        case 3:
                            elem.innerText = "Risque avéré avec " + test.culture;
                            elem.className = "text-danger";
                            if(_CONFIGURATION.passeport === true) setDisabled("next-2");
                        case 2:
                            elem.innerText = "Risque possible avec " + test.culture;
                            elem.className = "text-danger";
                            if(_CONFIGURATION.passeport === true) setDisabled("next-2");
                            break;
                        case 0:
                            elem.innerText = "Pas de valeur permettant de calculer le risque";
                            elem.className = "text-warning";
                            if(_CONFIGURATION.passeport === true) removeDisabled("next-2");
                            break;        
                        case 1:
                            elem.innerText = "Pas de risque détécté jusqu\'en " + lastYear ;
                            elem.className = "text-good";
                            if(_CONFIGURATION.passeport === true) removeDisabled("next-2");
                            break;   
                            default:
                            elem.innerText = 'Aucune donnée';
                            elem.className = "text-warning";
                            if(_CONFIGURATION.passeport === true) setDisabled("next-2");
                            break;
                        }
                    } else {
                        elem.innerText = "prélèvement dans la même région." ;
                        elem.className = "text-good";
                }
    
                if (getElement('btn-passeport-create')) {
                    setDisabled("next-2");
                    document.getElementById('btn-passeport-create').addEventListener('click', function() {
                        createHTMLcreatePasseport();
                        removeDisabled("btn-passeport-create");
                    });
                }
            }
        };
    }
}