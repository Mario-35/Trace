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
    if (mode("new")) {
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
    if (mode("new")) {
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
        if (validateStr('pointx') === false) isValid = false;
        if (validateStr('pointy') === false) isValid = false; 
    }

    if(type.value === "Sol cultivé") {
        if (mode(["edit", "edits", "add"])) return isValid;
        // The only way to test if in edit passport and not to be confused with view passport
        if (getElement("region").value !== _CONFIGURATION.region) {
            if (getElement('passeportNom-error')) {
                if (validateStr('passeportNom') === false) isValid = false;
                getElement('create-error').style.display = 'block';
                isValid = false;  
            }
            // If passeport not exit 
             if (getElement('btn-passeport-create') && validateFile('image') === false) isValid = false;   
        }
        if (notNull("cultures") === false) isValid = false;   
        else if (getElement("region").value !== _CONFIGURATION.region && getElement('btn-passeport-create')) {
                getElement('btn-passeport-create').style.background = 'red';
                isValid = false; 
        }
    }
    return isValid;
};

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
                setReadOnly([ "type"]);
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

updateProgressBar();