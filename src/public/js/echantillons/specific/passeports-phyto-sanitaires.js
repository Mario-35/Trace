
// async function refreshPasseportPhytosanitaire() {
//     head('refresh Passeport Phytosanitaire');
//     // get passeport id
//     const id = Number(getElement("passeport").value);
//     if (getElement("passeport") && id > 0) {
//         const temp = await getDatas(window.location.origin + '/passeport/' + id);
//         if (temp && temp.id) {            
//             createHTMLviewPasseport(temp);
//             return
//         }
//     }     
//     if (isContextMode(["id", "selection", "after", "aliquote"])) return;
//     // createHTMLbtnCreatePasseport();
//     // await getRpgInfos(getElement("rpgTab"), true);
// }

// get passeport information from API
async function setPasseport() {
    head("setPasseport");
    if (notNull("cultures") === false) {
        // Important to not async its out and at the same time get datas the test wil do agin after
        getRpgInfos(getElement("rpgTab"));
    } 
    const temp = await getDatas(`${window.location.origin}/passeport/${nomSite.value}/${getYear(prelevement)}`);
    if (temp) {
        getElement("passeport").value = temp.id;
        if (getElement("btn-passeport")) getElement("btn-passeport").remove();
        createHTMLviewPasseport(temp);
        removeDisabled("next-2");
    } else {
        if (isContextMode(["id", "selection", "after", "aliquote"])) return;
        await getRpgInfos(getElement("rpgTab"));        
    }
}

// Visualisation  passeport
function createHTMLviewPasseport(values) {
    if(!values) 
        values = {  
                    "id": 0,
                    "annee": "2019",
                    "nom": "Nom a déterminer",
                    "code": "FR",
                    "tracabilite": "005",
                    "identifiant": "BR13551",
                    "origine": "FR"
                };

    // getElement("passeport").value = values.id;

    getElement("blockPasseport").innerHTML = `
    <div class="form-group row-3"> 
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
        </div> 
    </div>
    
    <div class="form-group row-1">
        <button class="btn btn-test" id="printPasseport">Imprimer</button>
    </div>      
    `;
    //  button d'interrogation du rpg
    getElement('printPasseport').addEventListener('click', async function() {
        open(`http://localhost:3000/print/passeport/${passeport.value}`, "Imprimer", _PARAMPRINT);
    });

}

// create form passeport
function createHTMLcreatePasseport() {
    getElement("blockPasseport").innerHTML = `
                                <div class="form-group row-3"> 
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
                                          <input type="text" id="passeportNom" class="form-control" value="${nomSite.value} ${_YEAR}" readonly>
                                          <div class="error-message" id="passeportNom-error">Nom interne du passeport obligatoire</div>
                                      </div>

                                      <div class="form-group row-3">
                                          <label for="image">Joindre un fichier${+getElement("risqueRpg").value < 2 ? '' : ' de test négatif de laboratoire'}</label>
                                          <input class="form-control" type="file" name="image" id="image" accept=".doc,.docx,.pdf">
                                          <div class="error-message" id="image-error">L'ajout d'un fichier est obligatoire</div>                                          
                                      </div>
                                      
                                      <div class="form-group row-1">                    
                                          <label>&nbsp;</label> 
                                          <button class="btn btn-api form-group float-end" alt="Créer" id="passCreate">📰 Créer</button>
                                      </div>
                                  </div>
                                </div>
  `; 

  document.getElementById('passCreate').addEventListener('click', async function() {
    let isValid = true;   
    if (validateStr('passeportNom') === false) isValid = false;
    if (validateDate('prelevement') === false) isValid = false;
    if (isValid === false) return;
      const datas = {
          code: _CONFIGURATION.code, 
          site: nomSite.value, 
          origine: 'FR', 
          identifiant: _CONFIGURATION.identifiant, 
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
            if (res.id) {
                showModalOk("Passeport Crée");
                getElement("passeport").value= +res.id;
                setPasseport();
            }
            // refresh();
          } else {
              const resJson =  await response.json();
              showModalError(resJson.code + " : " + resJson.error);
          }
      }).catch(err => {
          showModalError(err); 
      });
      refresh();


  });
}