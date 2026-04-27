


async function start() {
    const ctx = createContext();
    // action son mode
    if (ctx.mode === "echantillon") {  // Edit mode
      // get echantillon with the API
      const datas = await getDatas(window.location.origin + "/echantillon/" + ctx.id);
      // rpg codes
      if (datas) {
        const now = new Date().toISOString();

        date.value = now.split('T')[0];
        time.value = now.split('T')[1].split('.')[0];

        addToOption(getElement('etat'), _CONFIGURATION.etats.split(","), datas.etat);
        loadValues(datas);
        
        saveetat.value = String(datas.etat);
        savestockage.value = String(savestockage.etat);

        new editingList(getElement("stockageList"), "Mots clés pour le stockage", "Ajouter une clé", datas.stockage, _CONFIGURATION["stockages"]);  

      }
    } else if (ctx.mode === 'selection') { // Selection Edits mode
        // get selection from API
        const temp = await getDatas(window.location.origin + "/selection/" + ctx.id);
        _STORE = {
            datas: temp,
            columns: Object.keys(temp[0])
        }
        setRange();
    } else log("Error mode");    
    updateButtonCreer(ctx);
}

start();
