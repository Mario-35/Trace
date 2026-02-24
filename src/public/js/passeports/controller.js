
function refresh() {
    head('refresh');
}

async function start() {
    let id = 0;
    if(window.location.href.includes('?id=')) {
        id = +window.location.href.split('?id=')[1] || 0;
    } 
    
    if (id > 0) {
        const datas = await getDatas(window.location.origin + "/passeport/" + id);
        loadDatas(datas[0]);
        changeTitle("Modification d'un passeport phytosanitaire");
        document.getElementById("btn-creer").innerText = "Modifier"; 
        setReadOnly(["annee", "tracabilite", "origine", "image"]);
        createHTMLviewPasseport(datas[0]);
    } else {
        createHTMLviewPasseport();
    }

    refresh();
}

start();