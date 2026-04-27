var map, marker;

function addMap() {
    var curLocation = [latitude.value, longitude.value];

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
        latitude.value = position.lat;
        longitude.value = position.lng;
        removeRpgInfos();
    });

    getElement('latitude').addEventListener('change', async function() {
        refreshMap();
    });

    getElement('longitude').addEventListener('change', async function() {
        refreshMap();
    });

}

function refreshMap() {
    const position = [parseInt(latitude.value.replace(',','.')), parseInt(longitude.value.replace(',','.'))];
    marker.setLatLng(position, {
        draggable: 'true'
    }).bindPopup(position).update();
    map.panTo(position);    
}

async function start() {
    const ctx = createContext();
    if(ctx.mode === "id") {  // Edit mode
        const datas = await getDatas(window.location.origin + "/site/" + ctx.id);
        loadDatas(datas);
        loadDatas(_COLUMNS);
        removeDisabled("btnApiRpg"); 
        changeTitle("Modification d'un site");
    } else if (ctx.mode === 'new') { //  Default add mode
    } else log("Error mode");
    updateButtonCreer(ctx);
    addMap();
}

start();






