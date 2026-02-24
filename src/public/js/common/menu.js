// Menu gauche
document.getElementById("left-pane").innerHTML = ` 
<nav role="navigation">
    <ul>
        <li><a href="./echantillons.html">Echantillons</a></li>
        <li><a href="./selections.html">Séléctions</a></li>
        <li><a href="./passeports.html">Passeports</a></li>
        <li><a href="./sites.html">Sites</a></li>
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

// Visualisation du passeport
function createHTMLviewPasseport(values) {
    if(!values) 
        values = {  "id": 0,
                    "annee": "2019",
                    "nom": "Nom a déterminer",
                    "code": "FR",
                    "tracabilite": "005",
                    "identifiant": "BR13551",
                    "origine": "FR"};

    getElement("passeport").value = values.id;

    getElement("blockPasseport").innerHTML = `
        <div class="container-center">
            <div class="pass-phyto border">
                <div class="flag" id="passeportFlag"><img class ="flag-eu" src="./assets/flag-eu.png"></div>
                <div class="title" id="passeportTitle" align="right"><p>Passeport phytosanitaire - ZP / Plant passport - PZ<br
                >Beet necrotic yellow vein virus</p></div>
                <div class="nom" id="passeportNom"><b>A</b> Sol</div>
                <div class="code" id="passeportCode"><p><b>B</b> ${values.code}-${values.identifiant}</p></div>
                <div class="trace" id="passeportTracabilite"><p><b>C</b> ${values.annee}-${String(values.tracabilite).padStart(4, '0')}</p></div>
                <div class="origine" id="passeportOrigine"><p><b>D</b> ${values.origine}</p></div>
            </div> 
        </div>`;
}

// Button de creation du passeport phytosanitaire
function createHTMLbtnCreatePasseport() {
    if (+getElement("passeport").value === 0) {        
        if (_CONFIGURATION.region == getElement("region").value)
            {
            getElement("blockPasseport").innerHTML = '';
        } else if (notNull("cultures")) {
            getElement("blockPasseport").innerHTML = `
            <div class="container-center">
                <div class="btn-group">
                    <button class="btn btn-passeport"  id="btn-passeport-create">
                        Créer un passeport phytosanitaire${+getElement("risqueRpg").value < 2 ? '' : ' avec test'} pour ${_YEAR}
                    </button>
                </div> 
            </div>`; 

            document.getElementById('btn-passeport-create').addEventListener('click', function() {
                createHTMLcreatePasseport();
                removeDisabled("btn-passeport-create");
            });    

        }
    }
}

function createHTMLcreatePasseport() {
    getElement("passeport").value = 0;
    getElement("blockPasseport").innerHTML = `
                                  <div class="form-row border">  
                                      <div class="form-group row-1">
                                          <div class="form-title">
                                              <label>Création d'un passeport phytosanitaire</label>
                                          </div>
                                          <div class="error-message" id="create-error">Créer le passeport avant de poursuivre</div>
                                      </div>
                                  </div>

                                  <div class="form-row border">

                                      <div class="form-group row-2">
                                          <label for="passeportNom">Nom interne du passeport</label>
                                          <input type="text" id="passeportNom" class="form-control" placeholder="Nom interne du passeport">
                                          <div class="error-message" id="passeportNom-error">Nom interne du passeport obligatoire</div>
                                      </div>

                                      <div class="form-group row-3">
                                          <label for="image">Joindre un fichier${+getElement("risqueRpg").value < 2 ? '' : ' de test négatif de laboratoire'}</label>
                                          <input class="form-control" type="file" name="image" id="image" accept=".doc,.docx,.pdf">
                                          <div class="error-message" id="image-error">L'ajout d'un fichier est obligatoire</div>                                          
                                      </div>
                                      
                                      <div class="form-group row-1">                    
                                          <label>&nbsp;</label>
                                          <button class="btn btn-api" alt="Créer" id="passCreate">
                                              <i class="fas fa-check"></i> Créer
                                          </button>
                                      </div>
                                  </div>
  `; 

  document.getElementById('passCreate').addEventListener('click', async function() {
    let isValid = true;   
    if (validateStr('passeportNom') === false) isValid = false;
    if (validateDate('prelevement') === false) isValid = false;
    if (isValid === false) return;
      const datas = {
          code: 'FR', 
          origine: 'FR', 
          identifiant: 'BR13551', 
          annee: getYear(prelevement), 
          tracabilite:  "001",
          nom: passeportNom.value
      }
      var input = document.querySelector('input[type="file"]');
      if (input.files[0]) {
          const formData = new FormData();
          formData.append('image', input.files[0]);
          const addFile = await fetch(window.location.origin + `/upload`, {
              method: "POST",
              body: formData,
          });
          const res = await addFile.json();
          datas["fichier"] = res.id;
      } else datas["fichier"] = 0;
           
      await fetch(window.location.origin + `/passeport`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(datas),
      }).then(async response => {
          if (response.status === 201) {
            const res = await response.json();
            if (res.id) 
                getElement("passeport").value= +res.id;
            refresh();
          } else {
              const resJson =  await response.json();
              showModalError(resJson.code + " : " + resJson.error);
          }
      }).catch(err => {
          showModalError(err); 
      });
      refresh();


  });

  setDisabled("btn-passeport-create");
}

function addToOption(name, listElements, selected) {
    var select = getElement(name);
    if (select) listElements.forEach(e => {
        var opt = document.createElement('option');
        opt.value = e;
        opt.innerHTML = e;
        if(selected && e === selected)
            opt.setAttribute("selected", "selected");
        select.appendChild(opt);
    });
};

function addToOptions(names, listElements) {
    names.forEach(name => addToOption(name, listElements));
};

function loadValue(elementName, value) {
    const elem = getElement(elementName);
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
            default:
                log(`${elem.name} err =====> ${elem.type}`);
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
    loadEchantillonLine(0);
    // show number lines
    showParentClass("rowNumber",'form-group'); 
    // event of the range
    getElement('rowLines').addEventListener('change', function() {
        loadEchantillonLine(row.value);
    });    
}

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