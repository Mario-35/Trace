function loadDatas(values) {
    _COLUMNS.forEach(e => {
        const elem = document.getElementById(e);
        if (elem && values[e]) {
            switch (elem.type) {
                case "date":
                    elem.value = values[e].split("T")[0];
                    break;
                case "textarea":
                    elem.value = JSON.stringify(values[e] || '{}');
                    break;
                case "checkbox":
                    elem.checked = values[e] === true;
                    break;
                case "text":
                case "select-one":
                    elem.value = values[e];
                    break;
                case "number":
                    elem.value = +values[e];
                    break;
                case "hidden":
                    elem.value = isNaN(values[e]) ? values[e] : +values[e];
                    break;
                default:
                    log(`${elem.name} error 🡺 ${elem.type}`);
                    break;
            }
        }

    });
};
/**
 * Checks that an element has a non-empty `name` and `value` property.
 * @param  {Element} element  the element to check
 * @return {Bool}             true if the element is an input, false if not
 */
const isValidElement = element => {
  return element.name;
};

/**
 * Checks if an element’s value can be saved (e.g. not an unselected checkbox).
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the value should be added, false if not
 */
const isValidValue = element => {
  return (!['checkbox', 'radio'].includes(element.type) || element.checked);
};


/**
 * Checks if an input is a `select` with the `multiple` attribute.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a multiselect, false if not
 */
const isMultiSelect = element => element.options && element.multiple;

/**
 * Retrieves the selected options from a multi-select as an array.
 * @param  {HTMLOptionsCollection} options  the options for the select
 * @return {Array}                          an array of selected option values
 */
const getSelectValues = options => [].reduce.call(options, (values, option) => {
  return option.selected ? values.concat(option.value) : values;
}, []);


/**
 * Retrieves input data from a form and returns it as a Array of columns name.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Array}                               form data names an array
 */
const formToColumns = elements => [].reduce.call(elements, (data, element) => {
  // Make sure the element has the required properties and should be added.
  if (element.name) {
      data.push(element.name);
  }
  return data;
}, []);

function getInactive(element) {
  return element.getAttribute("readonly") === "" ? true : false;
};

const formDatas = () =>  formToJSON(document.getElementsByClassName('formData')[0].elements);

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
const formToJSON = elements => [].reduce.call(elements, (data, element) => {
  // Make sure the element has the required properties and should be added.
  // if (isValidElement(element) && isValidValue(element) && !getInactive(element)) {
  if (isValidElement(element) && isValidValue(element)) {

    /*
     * Some fields allow for more than one value, so we need to check if this
     * is one of those fields and, if so, store the values as an array.
     */
    const max = element.getAttribute("maxlength") || 0;
     if (isMultiSelect(element)) 
      data[element.name] = getSelectValues(element);

    else if (element.type) switch (element.type) {
      case 'checkbox':
        data[element.name] = element.checked ? true : false;
        break
      case 'textarea':
          try {
              data[element.name] = JSON.parse(element.value);
          } catch (error) {
              data[element.name] = {};
          }
        break
      case 'number':
        data[element.name] = +element.value;
        break
      case 'select-one':
        data[element.name] = max > 0 ? element.value.slice(0, max): element.value;
        break
      case 'text':
      case 'date':
        data[element.name] = max > 0 ? element.value.slice(0, max): element.value;
        break
      case 'hidden':
        data[element.name] = isNaN(element.value) ? max > 0 ? element.value.slice(0, max): element.value : +element.value;
        break
      default:
        log(`${element.name} err 🡺 ${element.type}`);
    } else {
      log(`${element.name} error type`);
    }
  }
  return data;
}, {});

/**
 * A handler function to prevent default submission and run our custom script.
 * @param  {Event} event  the submit event triggered by the user
 * @return {void}
 */
const handleFormSubmit = event => {
  // Stop the form from submitting since we’re handling that with AJAX.
  event.preventDefault();
  // Call our function to get the form data.
  _DATAS = formToJSON(form.elements); 
  // ...this is where we’d actually do something with the form data...   
  if (getElement("ctx")) console.log(getElement("ctx"));

};

/*
 * This is where things actually get started. We find the form element using
* its class name, then attach the `handleFormSubmit()` function to the 
* `submit` event.
*/
const form = document.getElementsByClassName('formData')[0];
form.action = window.location.href.includes("/add") ? window.location.origin + "/" + window.location.href.split('/add')[1].split(".")[0].toLowerCase() : window.location.href;

// form.action = window.location.origin + `/echantillon`;
form.addEventListener('submit', handleFormSubmit);

_COLUMNS = formToColumns(form.elements); 
// important
document.getElementById("formTitle").innerText  = document.title;
