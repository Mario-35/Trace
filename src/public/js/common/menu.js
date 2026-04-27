// Menu gauche
document.getElementById("left-pane").innerHTML = ` 
<nav role="navigation">
    <ul>
        <li><a href="./campagnes.html">Campagnes</a></li>
        <li><a href="./echantillons.html">Echantillons</a></li>
        <li><a href="./passeports.html">Passeports</a></li>
        <li><a href="./sites.html">Sites</a></li>
        <li><a href="./evenements.html">Evenements</a></li>
        <li><a href="./api.html">Api</a></li>
        <li><a href="./configuration.html">Configuration</a></li>
    </ul>
</nav>`;

// Menu droite                
document.getElementById("splitter-nav-site").innerHTML = `
<nav role="navigation" class="splitter-nav-left splitter-menu-color">
    <a href="index.html"><div id="animeText" class="animeText"></div></a>    
</nav>
    <nav role="navigation" class="splitter-nav-right" id="splitter-nav-right">
    <nav role="navigation" class="splitter-nav-left">
    <img src="./assets/logo.png">
</nav>`;

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
        e = toTitleCase(e);
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
    getElement("rowNumber").innerText = 'Ligne : ' + index + ' sur ' + _STORE.datas.length ; 
};

class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

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
    getElement("btn-creer").innerText = `✔️ ${name}`;
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

function start() {
    const fx = new TextScramble(document.getElementById('animeText'));
    const phrases = [
    'Gestion Des échantillons',
    'Traçabilité des echantillons',
    'Impression des étiquettes',
    'Gestion des passeports phyto-sanitaires',
    'Utilisation des codes barres',
    'Un outil dévellopé par ADAM Mario',
    'Pour l\'UMR SAS de rennes en 2026',
    'Arreter de lire ce stupide message',
    'allez travailler',
    ]

    let counter = 0
    const next = () => {
    fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 800)
    })
    counter = (counter + 1) % phrases.length
    }

    next();
}

start();