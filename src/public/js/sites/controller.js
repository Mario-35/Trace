var map, marker;

function addMap() {
    var curLocation = [pointx.value, pointy.value ];

    map = L.map("map").setView(curLocation, 8);

    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18
    }).addTo(map);

    map.attributionControl.setPrefix(false);

    marker = new L.marker(curLocation, {
        draggable: 'true'
    });

    marker.addTo(map);

    marker.on('dragend', function(event) {
        var position = marker.getLatLng();
        marker.setLatLng(position, {
        draggable: 'true'
        }).bindPopup(position).update();
        pointx.value = position.lat;
        pointy.value = position.lng;
    });

    getElement('pointx').addEventListener('change', async function() {
        refreshMap();
    });

    getElement('pointy').addEventListener('change', async function() {
        refreshMap();
    });

}

function refreshMap() {
    const position = [parseInt(pointx.value.replace(',','.')), parseInt(pointy.value.replace(',','.'))];
    marker.setLatLng(position, {
        draggable: 'true'
    }).bindPopup(position).update();
    map.panTo(position);    
}

async function start() {
    let id = 0;
    if(window.location.href.includes('?id=')) {
        id = +window.location.href.split('?id=')[1] || 0;
    } 
    
    if (id > 0) {
        const datas = await getDatas(window.location.origin + "/site/" + id);
        loadDatas(datas);
        loadDatas(_COLUMNS);
        changeTitle("Modification d'un site");
        document.getElementById("btn-creer").innerText = "Modifier";
        _MODE = "add";
    } else _MODE = "new";  
    
    addMap();
}

start();






