let id = 0;
if (window.location.href.includes('?passeport=')) 
        id = +window.location.href.split('?passeport=')[1] || 0;

document.addEventListener("DOMContentLoaded", function () {
	const table = new JsonTable({
		jsonUrl: window.location.origin + "/list/echantillons" + `${id > 0 ? '/' + id : ""}`,
		editUrl: "/echantillon-add.html",
		printUrl: "/echantillon/",
		container: "#jsonTable",
		globalSearch: "#globalSearch",
		pagination: "#pagination",
		columns: structure,
        menuOptions: [
            {
                title : "Evenement pour cet échantillon",
                url: "evenement-add.html?echantillon=",
            },
            {
                title : "Tous les échantillons de cette série",
                filter: "Identification12",
            },
            {
                title : "Ajout d'échantillon(s) cette série",
                url: "echantillon-add.html?after=",
            },
            {
                title : "Créer un évenement cette série",
                url: "evenement-add.html?série=",
            }
            
        ]
	});
});


class ExcelToJSON {
    table = undefined;
    parseExcel(file) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary', cellDates: true });
            workbook.SheetNames.forEach((sheetName) => {
                if (sheetName.toUpperCase() === "IDENTIFICATION") {
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var json_object = JSON.stringify(XL_row_object);
                     _EXCELSRC = [..._EXCELSRC, ... JSON.parse(json_object)];
                    this.table = new JsonTable({
                        jsonUrl: "",
                        addUrl: "/addExcelEchantillon.html",
                        container: "#jsonTable",
                        globalSearch: "#globalSearch",
                        pagination: "#pagination",
                        print: false,
                        edit: false,
                        select: true,
                        data: _EXCELSRC.map((v, k) => ({...v, selected: true, id: k})),
                        columns: Object.keys(_EXCELSRC[0]).map(e => { return { "key": e, "title": e, "searchType": "excel" }})  
                    });
                }
            });
    
        };
        reader.onerror = (ex) => console.log(ex);
        reader.readAsBinaryString(file);
    }
};

if (document.getElementById("fileone")) {
    fileone.addEventListener("change", function(e) {
        var fileName = "";
        try {
            if (this.files && this.files.length > 1)
                fileName = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length);
            else
                fileName = e.target.value.split("\\").pop();
            ["globalSearchIcon", "globalSearch", 'exportExcel', 'blockImporter', 'raz'].forEach(elem => document.getElementById(elem).remove());
        } catch (err) {
            console.log(err);
        }
        var im = document.createElement('button');
        im.className ="btn btn-primary icon_plus btn-sm";
        im.id="importer" ;
        im.innerText="Importer" ;
        document.getElementById('ajouter').replaceWith(im)
    });
    fileone.addEventListener('change', handleFileSelect, false);
};

function handleFileSelect(evt) {
    var files = evt.target.files;
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
    document.getElementById('importer').addEventListener('click', async function() {
        const response = await xl2json.table.postStore();
        window.location.href ="./echantillon-add.html?excel=" + JSON.parse(response)[0].id;
    }); 
};
