// DOM Elements
const steps = document.querySelectorAll('.step');
const formSteps = document.querySelectorAll('.form-step');
const progressLine = document.getElementById('progress-line');
const nextButtons = document.querySelectorAll('.btn-next');
const prevButtons = document.querySelectorAll('.btn-prev');

// Current step tracker
let currentStep = 0;

// Update progress bar
function updateProgressBar() {
    const progressPercentage = (currentStep / (steps.length - 1)) * 100;
    progressLine.style.width = `${progressPercentage}%`;
    
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
};

// Show current step
function showStep(stepIndex) {
    formSteps.forEach((step, index) => {
        step.classList.toggle('active', index === stepIndex);
    });
    
    updateProgressBar();
};

// Form validation functions
function validateStep1() { 
    let isValid = true;   
    if (validateStr('programme') === false) isValid = false;
    if (validateStr('site') === false) isValid = false;
    if (validateStr('responsable') === false) isValid = false;
    if (validateNumber('numero', 998) === false) isValid = false;
    if (validateNumber('nombre', 999) === false) isValid = false;    
    if (validateDate('prelevement') === false) isValid = false;    
    if (isContextMode("new")) {
        const ToDate = new Date();
        if (new Date(getElement('prelevement').value).getTime() < ToDate.getTime()) {
            showModalError("La date ne peut être inferieur a celle du jour");
            return false;
        }
    }

    if (validateSelect('type') === false) isValid = false;    
    if (validateDate('peremption') === false) {
        if(document.getElementById("prelevement").value) { 
            const dates = document.getElementById("prelevement").value.split("-");
            document.getElementById("peremption").value = `${+dates[0] + 5}-${dates[1]}-${dates[2]}`;
        }        
    };
    if (isContextMode("new")) {
        if (isValid === true && document.getElementById("prelevement").value >= document.getElementById("peremption").value) {
            showModalError("La date de péremption doit être supérieure la date de prélévemnt");
            isValid = false;  
        }
    }
    return isValid;
};

function validateStep2() {
    let isValid = true;   
    if (validateStr('region') === false) isValid = false;
    if (validateStr('pays') === false) isValid = false;
    if (getElement("region").value !== _CONFIGURATION.region) {
        if (validateStr('latitude') === false) isValid = false;
        if (validateStr('longitude') === false) isValid = false; 
    }

    if (type.value.startsWith("Sol ")) {
        if (isContextMode(["id", "selection", "after"])) return isValid;

        // If not historical cultural get it and out without valid
        if (notNull("cultures") === false) {
            isValid = false;
            // Important to not async its out and at the same time get datas the test wil do agin after
            getRpgInfos(getElement("rpgTab"));
        }

        if(_CONFIGURATION.passeport === true && +getElement("passeport").value > 0) return isValid;
    }
    return isValid;
};

function validateStep3() {};

function validateStep4() {};

// Event Listeners
nextButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        // Validate current step before proceeding
        let isValid =  true;
        if (currentStep === 0) isValid = validateStep1();
        if (currentStep === 1) isValid = validateStep2();
        
        if (isValid) {
            currentStep++;
            showStep(currentStep);
            // to preseve change mask
            if (currentStep === 1) {                
                refreshType();   
                setReadOnly([ "type"]);
                setSite();
            }
            if (currentStep === 2) {
                new editingList(getElement("analysesList"), "Analyses effectuées", "Ajouter une analyses", analyses.value);  
                if(!nombreOuAnalyses.checked) nombre.value = analyses.value.split(',').length;
            }
            if (currentStep === 3) {}
            if (currentStep === 4) {
                canPrint("printEtiquette");
                if(!nombreOuAnalyses.checked) nombre.value = getElement("analyses").value.split(',').length;
                getElement("gabaritEtiquette").innerHTML = "";
                if (+_DATAS["passeport"] > 0) {
                    const tmp = toJson("etiquette");
                    tmp["sticker2"] = {"key":"passeport","size":"14px","align":"center"};
                    getElement("etiquette").value = JSON.stringify(tmp);
                }
                if (_DATAS["dossier"] != "") {
                    const tmp = toJson("etiquette");
                    tmp["sticker2"] = {"key":"dossier-numero","size":"14px","align":"center"};
                    getElement("etiquette").value = JSON.stringify(tmp);
                }
                _DATAS = formDatas();
                sticker_start(_DATAS);                
                refreshSteps();
            }
        }
    });
});

prevButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
    });
});

function refreshSteps() {
    disabled ("btn-creer", (isContextMode(["id", "selection"]) && Object.keys(filterModified(_DATAS)).length > 0) === false);
}

updateProgressBar();