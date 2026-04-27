
function refresh() {
    head('refresh');
}

async function start() {
    const ctx = createContext();
    if (ctx.mode === "idechantillon") {  // Edit mode
        const datas = await getDatas(window.location.origin + "/passeport/" + ctx.id);
        loadDatas(datas);
        changeTitle("Modification d'un passeport phytosanitaire");
        document.getElementById("btn-creer").innerText = "Modifier"; 
        setReadOnly(["annee", "tracabilite", "origine", "image"]);
        createHTMLviewPasseport(datas[0]);
    } else log("Error mode");

    refresh();
}
