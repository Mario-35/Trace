// global form datas
let _COLUMNS = [];


// get element by id or name with test

function getElement(name) {
  if (typeof name === "string") {
    element = document.getElementById(name);
    if (element) return element;
    console.log("element not found 🡺 " + name);
  } else return name;
}

// change title of the page
function changeTitle(title) {
  getElement("formTitle").innerText = title;
  document.title = title;
}

// =======================> Vidible
function setInvisible(element) {
  element = getElement(element);
  if(element) {
    element.classList.remove("visible");
    element.classList.add("invisible");
  }
}

function removeInvisible(element) {
  element = getElement(element);
  if (element) {
    element.classList.remove("invisible");
    element.classList.add("visible");
  }
}

function visible(element, test) {
  if (test) 
    removeInvisible(element);
  else
    setInvisible(element);
}

function multiplesetInvisible(names) {
    if(typeof names === "string") names = [names];
    names.forEach(name => {
        const elem = document.getElementById(name);
        if(elem)
          setInvisible(elem.parentNode.closest('.form-group'));
      });
}

function multipleremoveInvisible(names) {
    if (typeof names === "string") names = [names];
    names.forEach(name => {
        const elem = document.getElementById(name);
        if(elem) 
          removeInvisible(elem.parentNode.closest('.form-group'));
      });
}

function setVisible(list, visible) {
    list.forEach(name => {
      const elem = document.getElementById(name);
      if (name == visible ) 
        removeInvisible(elem);
      else 
        setInvisible(elem)
    });
}

// =======================> Parent Class


function showParentClass(elementName, className) {
  const elem = document.getElementById(elementName);
  if(elem)
    removeInvisible(elem.parentNode.closest('.' + className));
}

function hideParentClass(elementName, className) {
    const elem = document.getElementById(elementName);
      if(elem)
        setInvisible(elem.parentNode.closest('.' + className));
}

function parentClass(elementName, className, test) {
  if (test)
    showParentClass(elementName, className);
  else 
    hideParentClass(elementName, className);
}

// =======================> Readonly

function setReadOnly(names) {
    if (typeof names === "string") names = [names];
    names.forEach(name => {
        const elem = getElement(name);
        if (elem) {
            elem.setAttribute("readonly", "");
            elem.setAttribute("disabled", "");
        }
      });
}

function removeReadOnly(names) {
    if (typeof names === "string") names = [names];
    names.forEach(name => {
        const elem = getElement(name);
        if (elem) {
            elem.removeAttribute("readonly");
            elem.removeAttribute("disabled");
        }
      });
}

function readOnly(test, element) {
    if (test)
            removeReadOnly(element);
        else 
            setReadOnly(element);
};

// =======================> Disable

function setDisabled(element) {
    elem = getElement(element);
    if(elem) 
        elem.setAttribute("disabled", "");
}

function removeDisabled(element) {
    elem = getElement(element);
    if(elem) 
       elem.removeAttribute("disabled");
}

function disabled(element, test) {
  if (test)
    setDisabled(element)
  else
    removeDisabled(element);
}

function multiSetDisabled(names) {
    if(typeof names === "string") names = [names];
    names.forEach(name => setDisabled(name));
}

function multiRemoveDisabled(names) {
    if(typeof names === "string") names = [names];
    names.forEach(name => removeDisabled(name));
}

// version date
console.log("version : 06/03/2026 ADAM Mario");

