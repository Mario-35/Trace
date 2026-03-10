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
    if (validateStr('site') === false) isValid = false;
    if (validateStr('pays') === false) isValid = false;
    if (validateStr('region') === false) isValid = false;
    if (validateStr('latitude') === false) isValid = false;
    if (validateStr('longitude') === false) isValid = false;    
    return isValid;
};

function validateStep2() {
    let isValid = true;    
    if (validateStr('nom') === false) isValid = false;
    if (validateStr('pays') === false) isValid = false;
    if (validateStr('region') === false) isValid = false;
    if (validateStr('latitude') === false) isValid = false;
    if (validateStr('longitude') === false) isValid = false;
    return isValid;
};

function validateStep4() {};

function validateStep5() {};

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
            
            // Populate review section when moving to step 4
            if (currentStep === 3) {
                
                //
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