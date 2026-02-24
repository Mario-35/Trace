head =(title) => {
    if(_DEBUG)  console.log('='.repeat(15) + ' ' + title + ' ' + '='.repeat(15));
}

log =(title) => {
    console.log(title);
}

const doubleQuotes = (input) => `"${input}"`;
const simpleQuotes = (input) => `'${input}'`;
const getYear = (input) => input.value.split('-')[0];

function addToJson(name, key, value) {
    const tmp = toJson(name);
    if (value.trim() === "") 
        delete tmp[key];
        else tmp[key] = value;
    document.getElementById(name).value =  JSON.stringify(tmp);
}

function toJson(name) {
    if(name) {
        const element = getElement(name);
        if (element && element.value) {
            try {
                return JSON.parse(document.getElementById(name).value);
            } catch (error) {    
               log("======= ERROR =============" + name + "=============================");
               log(getElement(name).value);
               log(error);
            }
        }
    }
    return JSON.parse('{}'); 
}

function validateFile(name) {
    const element = getElement(name);
    if(element) {
        const elementError = getElement(name + '-error');
        if (!element.value || element.files[0].trim() === "") {
            elementError.style.display = 'block';
            return false;
        } else {
            elementError.style.display = 'none';
        }    
    }
}

function validateStr(name) {
    const element = getElement(name);
    if (element) {
        const elementError = getElement(name + '-error');
        if (!element.value.trim()) {
            elementError.style.display = 'block';
            return false;
        } else {
            elementError.style.display = 'none';
        }    
    }
}

function validateSelect(name) {
    const element = getElement(name);
    const elementError = getElement(name + '-error');
    if (element.value === '---- Aucun ----') {
        elementError.style.display = 'block';
        return false;
    } else {
        elementError.style.display = 'none';
    }    
}

function validateNumber(name, max) {
    const element = getElement(name);
    const elementError = getElement(name + '-error');
    if (!element.value.trim() || element.value < 1 || element.value > max) {
        elementError.style.display = 'block';
        return false;
    } else {
        elementError.style.display = 'none';
    }    
}

function validateDate(name) {
    const element = getElement(name);
    const elementError = getElement(name + '-error');
    if (!element.value) {
        elementError.style.display = 'block';
        return false;
    } else {
        elementError.style.display = 'none';
    }    
}

function addOptions(name, listElements) {
    // init select for sticker
    var select = getElement(name);
    Object.keys(listElements).forEach(e => {
        var opt = document.createElement('option');
        opt.value = listElements[e];
        opt.innerHTML = e;
        select.appendChild(opt);
    });
};

function notNull(element) {
    const elem = getElement(element);
    if (elem) {            
        switch (elem.type) {
            case "date":
                return (elem.value) ? elem.value.trim().length > 0 : false;
                case "textarea":
                    try {                 
                        return (elem.value) ? (Object.keys(JSON.parse(elem.value)).length > 0) : false;
                    } catch (error) {
                        return false;
                    }
                    case "number":
                        return (elem.value) ? +value > 0 : false;        
                        default:
                            return (elem.value) ? true : false;
        }
    };
    return false;
}
