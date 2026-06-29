


async function start() {
    const ctx = createContext();
    // action son mode
    const now = new Date();
    if (ctx.mode === "echantillon") {  // Edit mode
      // get echantillon with the API
      const datas = await getDatas(window.location.origin + "/echantillon/" + ctx.id);
      // rpg codes
      if (datas) {
        setElementValue(date, now.getFullYear()+"-"+(("0" + (now.getMonth() + 1)).slice(-2))+"-"+(("0" + now.getDate()).slice(-2)) );
        setElementValue(time, now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());

        addToOption(getElement('etat'), _CONFIGURATION.etats, "Créer");
        loadValues(datas);
        
        setElementValue(saveetat, String(datas.etat));
        setElementValue(savestockage, String(savestockage.etat));

        new editingList(getElement("stockageList"), "Mots clés pour le stockage", "Ajouter une clé", datas.stockage, _CONFIGURATION["stockages"]);  

      }
    } else if (ctx.mode === "id") {  // Edit mode
        // get echantillon with the API
        const datas = await getDatas(window.location.origin + "/evenement/" + ctx.id);
        // rpg codes
        if (datas) {
          console.log(datas);
          loadValues(datas);
          setElementValue(date, datas["date"].split(' ')[0]);
          setElementValue(time, datas["date"].split(' ')[1]);
          addToOption(getElement('etat'), _CONFIGURATION.etats, datas["saveetat"]);
        }            
    } else if (ctx.mode === 'selection') { // Selection Edits mode
        // get selection from API
        const temp = await getDatas(window.location.origin + "/selection/" + ctx.id);
        _STORE = {
            datas: temp,
            columns: Object.keys(temp[0])
        }
        setRange();
    } else if (ctx.mode === 'serie') { // Selection Edits mode
      const datas = await getDatas(window.location.origin + "/echantillons/serie/" + ctx.id);
      // rpg codes
      if (datas) {
        setElementText("formTitle", `Ajout d'un évenement pour ${Object(datas).length} échantillon(s)`);
        setElementValue(date, now.getFullYear()+"-"+(("0" + (now.getMonth() + 1)).slice(-2))+"-"+(("0" + now.getDate()).slice(-2)) );
        setElementValue(time, now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
        addToOption(getElement('etat'), [_RIEN, ... _CONFIGURATION.etats], _RIEN);
      }      
    } else log("Error mode");    
    updateButtonCreer(ctx);
}

start();
