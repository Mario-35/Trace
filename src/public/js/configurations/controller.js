let selected = null;

// make list for draggable elements
function MakeList(name) {
  const list = name.toLowerCase().replace("list","");
  _CONFIGURATION[list].forEach((e, i) => addElement(getElement(name), e,i));
  const items = document.querySelectorAll('#' + name + ' > li');
  items.forEach((item) => {
    makeDraggable(item);
  });
  getElement(list).value = _CONFIGURATION[list];
}

// add element to draggable list
function addElement(element, name, index) {
  const li = document.createElement("li");
  li.setAttribute("draggable", 'true');
  li.setAttribute("data-index", index);
  li.textContent = name;
  element.appendChild(li); 
  makeDraggable(li);
}

// make element draggable
function makeDraggable(item) {
  item.addEventListener('dragstart', dragStart);
  item.addEventListener('drop', dropped);
  item.addEventListener('dragenter', cancelDefault);
  item.addEventListener('dragover', cancelDefault);
};

function dragStart(e) {
  selected = e.target;
  const index = selected.dataset.index;
  e.dataTransfer.setData('text/plain', index);
}

function dropped(e) {
  cancelDefault(e);

  if (isBefore(selected, e.target)) {
    e.target.parentNode.insertBefore(selected, e.target);
  } else {
    e.target.parentNode.insertBefore(selected, e.target.nextSibling);
  }
  updateValue();
}

function isBefore(el1, el2) {
  let cur;
  if (el2.parentNode === el1.parentNode) {
    for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
      if (cur === el2) return true;
    }
  }
  return false;
}

function cancelDefault(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

function addKey(event) {
  if(addItemLength() > 0 && event.keyCode == 13) {
    createListItem();
  }
}

// get the list on the actual step
function getNameList() { return  currentStep === 1 ? stockages : listEtats};
function getNameElement() { return  currentStep === 1 ? stockages : etats };


// update values on the hidden form value
function updateValue() {
  const items = Array.from(getElement(getNameList()).children);
  getElement(getNameElement()).value = items.map(e => e.innerText).join(",");
}


// we start here
function start() {
  site.value = _CONFIGURATION.site || "UMR Sas Rennes";
  pays.value =  _CONFIGURATION.pays || "France";
  region.value =  _CONFIGURATION.region || "Bretagne";
  latitude.value =  _CONFIGURATION.latitude || "48.11256463781973",
  longitude.value =  _CONFIGURATION.longitude || "-1.6567440482485551",
  code.value = _CONFIGURATION.code || "FR";
  identifiant.value = _CONFIGURATION.identifiant || "BR13551";

  // create draggable lists
  // MakeList("listStockages");
  // MakeList("listEtats");
  
  // get default sticker config 
  getElement("etiquette").value = JSON.stringify(_CONFIGURATION.etiquette);
  // set all selectable elements
  
  getElement('excelSelect').innerHTML =  excelColumns.map(e => `<option title="${e}">${e}</option>`);
  addToOption(getElement('element'), Object.keys(_CONFIGURATION.stickerElements));
  
  new editingList(getElement("stockagesList"), "Mots clés pour le stockage", "Ajouter une clé", _CONFIGURATION["stockages"]);  
  new editingList(getElement("etatsList"), "Mots clés pour les différents états", "Ajouter un état", _CONFIGURATION["etats"]);
  
  sticker_start(_CONFIGURATION.stickerElements);
}   

start();