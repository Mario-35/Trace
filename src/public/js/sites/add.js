
// Form validation functions
function validateSite() {
    let isValid = true;   
    if (validateStr('nom') === false) isValid = false;
    if (validateStr('pays') === false) isValid = false;
    if (validateStr('region') === false) isValid = false;
    if (validateStr('latitude') === false) isValid = false;
    if (validateStr('longitude') === false) isValid = false;
    return isValid;
}



