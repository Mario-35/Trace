const handleCloseModal = event => {
    // Stop the form from submitting since we’re handling that with AJAX.
    event.preventDefault();
    // Hide modal.
    //  modal.setAttribute("style", "display:none;");
    // Delete content
    modal.innerHTML = '';
}

function showModalOk( message, redirectOk) {
    getElement("modal").innerHTML =` 
        <article class="modal">
            <section class="modal__content modal__ok">
                <h1 class="modal__heading">${document.title }</h1>
                <p class="modal__copy">${message}</p>
                <button id="close" class="modal__close">&times;</button>
                <p class="modal__actions">
                    <button id="ok" class="modal__action modal__action--ok">Ok</button>
                </p>
            </section>
        </article>`;

    const modal = document.querySelector('.modal');

    getElement("close").addEventListener('click', handleCloseModal);

    getElement("ok").addEventListener('click', (event) => {
        event.preventDefault();
        modal.setAttribute("style", "display:none;");
        if (redirectOk) window.location.href = redirectOk;
    });
}

function showModalError( message) {
    getElement("modal").innerHTML =` 
        <article class="modal">
        <section class="modal__content modal__error">
            <h1 class="modal__heading">${document.title }</h1>
            <p class="modal__copy">${message}</p>
            <button id="close" class="modal__close">&times;</button>
            <p class="modal__actions">
                <button id="ok" class="modal__action modal__action--ok">Ok</button>
            </p>
        </section>
        </article> `;

        const modal = document.querySelector('.modal');

        getElement("close").addEventListener('click',  handleCloseModal);
        
        getElement("ok").addEventListener('click',  handleCloseModal);
}
    
function showModalPrint(options) {
    // option {
    //      echantillon : echantillon id
    //      passeport : passeport id
    //      identification : identification string;
    // }
    // identification = identification || false;
    getElement("modal").innerHTML =` 
        <article class="modal">
            <section class="modal__content modal__ok">
                <h1 class="modal__heading">${document.title }</h1>
                <button id="close" class="modal__close">&times;</button>
                ${ options.passeport  ? '<label> <input type="checkbox" id ="printPasseports" checked> <span>Imprimer les passeports</span> </label>' : ''}                
                <label> <input type="checkbox" id ="printEtiquettes" checked> <span>Imprimer les étiquettes</span> </label>
                <p class="modal__actions">
                    <button id="cancel" class="modal__action modal__action--negative">Non</button>
                    <button id="accept" class="modal__action modal__action--positive">Oui</button>
                </p>
            </section>
        </article>`;

    const modal = document.querySelector('.modal');

    getElement("close").addEventListener('click',  (event) => {
        event.preventDefault();
        modal.setAttribute("style", "display:none;");
        window.location.href =`${window.location.origin}/index.html`;
    });
    
    getElement("cancel").addEventListener('click',  (event) => {
        event.preventDefault();
        modal.setAttribute("style", "display:none;");
        window.location.href =`${window.location.origin}/index.html`;
    });
    
    getElement("accept").addEventListener('click',  (event) => {
        event.preventDefault();
        modal.setAttribute("style", "display:none;");
        let redirect = `${window.location.origin}//index.html`;
        // if (getElement("printPasseports") && getElement("printPasseports").checked && getElement("printPasseports").checked) {
        //    redirect = `${window.location.origin}/print/echantillonPasseport/${options.echantillon}`; 
        // }
        if (getElement("printEtiquettes").checked) {
            redirect = options.echantillon
                ? `${window.location.origin}/print/echantillon/${options.echantillon}`
                : options.selection 
                    ? `${window.location.origin}/print/selection/${options.selection}`
                    : `${window.location.origin}/print/identification/${options.identification}`;
        }
        if (getElement("printPasseports") && getElement("printPasseports").checked) {
            redirect = `${window.location.origin}/print/passeport/${options.passeport}`;
        }
        open(redirect, "Imprimer", _PARAMPRINT);
    });
}

function showModalList(titleKey, titleValue, values, errorString) {
    if (values) {
        getElement('modal').innerHTML =  `
        <article class="modal">
        <div id="scrollable-modal" class="scrollable-modal hide">
                <div class="list-header">
                    <span>${titleKey}</span>
                    <span>${titleValue}</span>
                </div>
                <div id="list-container" class="list-container">
                    <div class="list">
                        <ul class="options"> ${Object.keys(values).map(e => `<li>${e}</li>`).join("")} </ul>
                        <ul class="options"> ${Object.values(values).map(e => `<li ${errorString && e.includes(errorString) ? `class="errorList"`: ''}>${e}</li>`).join("")}</ul>
                    </div>
                </div>
            </div>
        </article> `;

        if(errorString && Object.values(values).filter(e => e.includes('Trouvé')).length > 0 ) element.value = '';
    
        getElement('scrollable-modal').className = "scrollable-modal";

        modal.addEventListener("click", handleCloseModal);
    }
}


const handleCloseModalEdit = event => {
}


const handleCloseModalMario = event => {
    // Stop the form from submitting since we’re handling that with AJAX.
    event.preventDefault();
    // Hide modal.
     modal.setAttribute("style", "display:none;");
    // Delete content
    modal.innerHTML = '';
}


function showModalEditingList(titleKey, titleValue, element, callback) {
    if (element) {
        getElement('modal').innerHTML =  `
        <article class="modal">
            <section class="modal__content modal__list">
                <button id="close" class="modal__close">&times;</button>
                <input type="hidden" id="modalEdit" name="modalEdit">
                <div id="modalEditList" class="modal-control"></div>                
                <p class="modal__actions">
                    <button id="ok" class="modal__action modal__action--ok">Ok</button>
                </p>
            </section>
        </article> `;
        
        new editingList(getElement("modalEditList"), titleKey, titleValue, element.value);  
        
        
        getElement("close").addEventListener('click',  handleCloseModal);


        getElement("ok").addEventListener("click", (event) => {
            // Stop the form from submitting since we’re handling that with AJAX.
            event.preventDefault();
            element.value = modalEdit.value;
            callback();
             modal.innerHTML = '';
        });
    }
}