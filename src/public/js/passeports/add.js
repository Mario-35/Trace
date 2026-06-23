
// Form validation functions
function validatePasseport() {
    if (validateStr('annee') === false) return false;
    if (validateStr('nom') === false) return false;
    if (validateStr('tracabilite') === false) return false;
    if (validateStr('origine') === false) return false;
    return true;
}

function addSpecialOptions(name, listElements) {
        // init select for sticker
    var select = document.getElementById(name);
    Object.keys(listElements).forEach(e => {
        var opt = document.createElement('option');
        opt.value = listElements[e];
        opt.innerHTML = `${e} [${listElements[e]}]`;
        select.appendChild(opt);
    });
    setElementValue(name, "FR");
};

addSpecialOptions("origine", {
    "Autriche" : "AT",
    "Belgique" : "BE",
    "Bulgarie" : "BG",
    "Croatie" : "HR",
    "Chypre" : "CY",
    "Tchéquie" : "CZ",
    "Danemark" : "DK",
    "Estonie" : "EE",
    "Finlande" : "FI",
    "France" : "FR",
    "Allemagne" : "DE",
    "Grèce" : "GR",
    "Hongrie" : "HU",
    "Irlande" : "IE",
    "Italie" : "IT",
    "Lettonie" : "LV",
    "Lituanie" : "LT",
    "Luxembourg" : "LU",
    "Malte" : "MT",
    "Pays" : "as",
    "Pologne" : "PL",
    "Portugal" : "PT",
    "Roumanie" : "RO",
    "Slovaquie" : "SK",
    "Slovénie" : "SI",
    "Espagne" : "ES",
    "Suède" : "SE",
});


