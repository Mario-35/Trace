// global form datas
let _COLUMNS = [];



function getElement(name) {
  if (typeof name === "string") {
    element = document.getElementById(name);
    if (element) return element;
    console.log("element not found ========> " + name);
  } else return name;
}

function changeTitle(title) {
  getElement("formTitle").innerText = title;
  document.title = title;
}

function hide(element) {
    element = getElement(element);
    if(element) {
      element.classList.remove("visible");
      element.classList.add("invisible");
    }
}

function show(element) {
    element = getElement(element);
    if (element) {
      element.classList.remove("invisible");
      element.classList.add("visible");
    }
}

function showParentClass(elementName, className) {
    const elem = document.getElementById(elementName);
      if(elem)
        show(elem.parentNode.closest('.' + className));
}

function hideParentClass(elementName, className) {
    const elem = document.getElementById(elementName);
      if(elem)
        hide(elem.parentNode.closest('.' + className));
}

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

function multiSetDisabled(names) {
    if(typeof names === "string") names = [names];
    names.forEach(name => setDisabled(name));
}

function multiRemoveDisabled(names) {
    if(typeof names === "string") names = [names];
    names.forEach(name => removeDisabled(name));
}

function multipleHide(names) {
    if(typeof names === "string") names = [names];
    names.forEach(name => {
        const elem = document.getElementById(name);
        if(elem)
          hide(elem.parentNode.closest('.form-group'));
      });
}

function multipleShow(names) {
    if (typeof names === "string") names = [names];
    names.forEach(name => {
        const elem = document.getElementById(name);
        if(elem) 
          show(elem.parentNode.closest('.form-group'));
      });
}

function setVisible(list, visible) {
    list.forEach(name => {
      const elem = document.getElementById(name);
      if (name == visible ) 
        show(elem);
      else 
        hide(elem)
    });
}


// version date
  console.log("version : 13/06/2025 ADAM Mario");

  function checkFree(e){
  if(e.target.value == 3 ){
    var tb = document.querySelector(".DropDownInputOverride");
    tb.style.display ="inline-block";
  }else{
    var tb = document.querySelector(".DropDownInputOverride");
    tb.style.display ="none";
  }
}
