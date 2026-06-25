document.getElementById("left-pane").innerHTML = ` 
		<nav role='navigation'>
  <ul class="menu">
    <li class="item"><a href="./campagnes.html" class="link">Campagnes</a></li>
    <li class="item item--parent${testWhere('echantillon') ?' item--opened' : ''}" aria-expanded="false" aria-controls="collapsible-0">
      <a class="menu__span">Echantillons</a>
      <ul class="menu" aria-hidden="true" id="collapsible-0">
        <li class="item"><a href="./echantillons.html" class="link">Liste des échantillons</a></li>
        <li class="item"><a href="./echantillon-add.html" class="link">Ajouter</a></li>
        <li class="item"><a href="/documentation/echantillons" class="link">Documentation</a></li>
      </ul>
    </li>
    <li class="item item--parent${testWhere('passeport') ?' item--opened' : ''}" aria-expanded="false" aria-controls="collapsible-1">
      <a class="menu__span">Passeports</a>
      <ul class="menu" aria-hidden="true" id="collapsible-1">
        <li class="item"><a href="./passeports.html" class="link">Liste des passeports</a></li>
        <li class="item"><a href="/documentation/passeports" class="link">Documentation</a></li>
      </ul>
    </li>
    <li class="item item--parent${testWhere('site') ?' item--opened' : ''}" aria-expanded="false" aria-controls="collapsible-2">
      <a class="menu__span">Sites</a>
      <ul class="menu" aria-hidden="true" id="collapsible-2">
        <li class="item"><a href="./sites.html" class="link">Liste des sites</a></li>
        <li class="item"><a href="./site-add.html" class="link">Ajouter</a></li>
        <li class="item"><a href="/documentation/sites" class="link">Documentation</a></li>
      </ul>
    </li>
    <li class="item item--parent${testWhere('evenement') ?' item--opened' : ''}" aria-expanded="false" aria-controls="collapsible-3">
      <a class="menu__span">Evenements</a>
      <ul class="menu" aria-hidden="true" id="collapsible-3">
        <li class="item"><a href="./evenements.html" class="link">Liste des evenements</a></li>
        <li class="item"><a href="/documentation/evenements" class="link">Documentation</a></li>
      </ul>
    </li>      
    <li class="item"><a href="./api.html" class="link">Api</a></li>
    <li class="item"><a href="/documentation/procedure" class="link">Procedure</a></li>
    <li class="item"><a href="/documentation/imprimante" class="link">Imprimante Etiquette</a></li>
    <li class="item"><a href="./configuration.html" class="link">Configuration</a></li>
  </ul>
</nav>`;

// Menu droite                
document.getElementById("splitter-nav-site").innerHTML = `
<nav role="navigation" class="splitter-nav-left splitter-menu-color">
    <a href="index.html" class="index">
        des
    </a>    
</nav>
<nav role="navigation" class="splitter-nav-right" id="splitter-nav-right">
<nav role="navigation" class="splitter-nav-left">
<img src="./assets/logo.png">`;

function toTitleCase(str) {
    try {
        return str.toLowerCase().split(' ').map((word) => {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
        
    } catch (error) {
        return str        
    }
}

function addToOption(name, listElements, selected) {
    var select = getElement(name);  
    const options = [];
    for (i = 0; i < select.length; i++) 
        options.push(select.options[i].value);
    if (select) listElements.filter(e => !options.includes(e)).forEach(e => {
        // e = toTitleCase(e);
        var opt = document.createElement('option');
        opt.value = e;
        opt.innerHTML = e;
        if(selected && e === selected)
            opt.setAttribute("selected", "selected");
        select.appendChild(opt);
    });
};

function addDataList(name, listElements) {
    var select = getElement(name);
    select.setAttribute("list", name +"s"); 
    if (select) {
        var datalist = document.createElement('datalist');
        datalist.id = name +"s";
        listElements.forEach(e => {
            var opt = document.createElement('option');
            opt.value = e;
            opt.innerHTML = e;
            datalist.appendChild(opt); 
        });
        select.appendChild(datalist); 
    }
};


function loadValue(elementName, value) {
    const elem = document.getElementById(elementName);
    if (elem && value) {            
        switch (elem.type) {
            case "date":
                elem.value = value.split("T")[0];
                break;
            case "textarea":
                elem.value = JSON.stringify(value || '{}');
                break;
            case "checkbox":
                elem.checked = value === true;
                break;
            case "text":
            case "select-one":
                elem.value = value;
                break;
            case "number":
                elem.value = +value;
                break;  
            case "hidden":
                const list = document.getElementById(`${elementName}List`);
                if (list) 
                    new editingList(list, "Analyses effectuées", "Ajouter une analyses", value);                       
                else elem.value = isNaN(value) ? value : +value;
                break;  
            default:
                log(`${elem.name} error 🡺 ${elem.type}`);
                break;
        }
    };
}

function loadValues(values, columns) {
    columns = columns || Object.keys(values);
    columns.forEach(e => {
        if (values[e]) loadValue(e, values[e]);
    });
}

function setRange() {
    // Création du range
    getElement("rowLines").innerHTML = `<input type="range" min="0" value="0" max="${+_STORE.datas.length}" id="row" /> `;
    // load first line
    loadRangeLine(0);
    // show number lines
    showParentClass("rowNumber",'form-group'); 
    // event of the range
    getElement('rowLines').addEventListener('change', function() {
        loadRangeLine(row.value);
    });    
}

// load line from importation store
async function loadRangeLine(index) {
    if(Array.isArray(_STORE.columns)) {
        loadValues( _STORE.datas[index]);
        if (isContextMode(["aliquote","selectionaliquote"])) showAliquote(_STORE.datas[index]);
    } else {
        Object.keys(_STORE.columns).forEach(column => {
            loadValue(column, _STORE.datas[index][_STORE.columns[column]]);
            getElement("identification").value = createIdentification(index);
            if (isContextMode(["aliquote","selectionaliquote"])) showAliquote(column, _STORE.datas[index][_STORE.columns[column]]);
        });
    }
    setElementText("rowNumber", 'Ligne : ' + index + ' sur ' + _STORE.datas.length); 
};

function updateButtonCreer(ctx) {
    let name = "Créer";
    switch (ctx.mode) {
        case 'id':  
            name = "Modifier";
            break;
        case 'after':
             name= "Ajouter";
            break;
        case 'excel': 
            name= "Importer";
            break;
    }
    setElementText("btn-creer", `✔️ ${name}`);
}
// show elements with context test
function updateReadOnly(ctx) {
    updateButtonCreer(ctx);

    if (ctx.mode === 'excel') return;
    
    // loop on form element
    [].reduce.call(form.elements, (data, element) => {
        // if name present is present in form 
        let show = element.name ? false : true;     
        if (element.name) { 
            if (element.getAttribute("canedit")) {
                switch (element.getAttribute("canedit")) {
                    // never so it's never editable
                    case "never":
                        show = false;                        
                        break;
                    // always editable
                    case "always":
                        show = true;                        
                        break;
                    // editable if no value
                    case "notNull":
                        show = (element.value && element.value === _AUCUN);                     
                        break;
                    // editable in edit, new or after mode
                    case "true":
                        show = isContextMode(['new','id', 'adter']);                     
                        break;
                    // only if etat in Créer value
                    case "etat:Créer":
                        show = getElement('etat').value === 'Créer';                     
                        break;
                }
            // in new mode editable is true
            }  else  show = (ctx.mode ===  'new');
        }
        // active or not
        if (show)
            element.removeAttribute("readonly");
        else 
            element.setAttribute("readonly", "");
    });
}

function toggleSubmenu() {
    const itemHeight = 34;
    const $submenu = this.querySelector('.menu');
    const submenuItemsLength = $submenu.querySelectorAll('.item').length;
    const submenuHeight = submenuItemsLength * itemHeight;
    const isOpened = this.classList.contains('item--opened');

    if(!isOpened) {
        this.setAttribute('aria-expanded', 'true');
        $submenu.setAttribute('aria-hidden', 'false');
        $submenu.style.maxHeight = submenuHeight + 'px';
    } else {
        this.setAttribute('aria-expanded', 'false');
        $submenu.setAttribute('aria-hidden', 'true');
        $submenu.style.maxHeight = '0px';
    }

    this.classList.toggle('item--opened');
}

function start() {
    const parentItems = document.querySelectorAll('.item--parent');
    
    function addListeners($element) {
      $element.addEventListener('click', toggleSubmenu)
    }
    
    parentItems.forEach(addListeners);
}

start();