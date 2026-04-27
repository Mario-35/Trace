class editingList {	
	constructor(element, message, placeholder, values, keys) {
		this.key = keys ? true : false;
		this.name = element.id.replace('List', '');
		this.valuesElement = document.getElementById(this.name);
		this.values = values || this.valuesElement.value;
		this.placeholder = placeholder;
		this.selected = undefined;
		element.innerHTML = `
		<label for="addCleEtat">${message} </label>
			<div class="listbox-area">
			${this.key ? `<div class="grid">`: '' }
				<controls>
					${this.key ? `
					<select name="cle" id="cle">
						<option value="">-- Choisir une clé --</option>
						${keys.map(e => `<option>${e}</option>`)}
					</select>
					<input id="txt${this.name}" class="txtKey" placeholder="${placeholder}" />
					`: `<input id="txt${this.name}" class="txtTodo" placeholder="${placeholder}" />`}
					<button id="btnAdd${this.name}" class="btnAdd">Ajouter</button>
				</controls>
			${this.key ? `</div>`: '' }
			<ul id="ul${this.name}" class="ulListes"></ul>
		</div>
		`;
		this.ulItem = document.getElementById(`ul${this.name}`);
		this.init();
	}

	setDatas() {
		if (this.key) {
			const vals = {};
			Array.from(this.ulItem .querySelectorAll('li')).map(option => option.textContent).filter(e => e !== "").forEach(e => {
				const data = e.split(' : ');
				vals[data[0]] = data[1];
			});
			this.valuesElement.value = JSON.stringify(vals);		
		} else {
			this.valuesElement.value = Array.from(this.ulItem .querySelectorAll('li')).map(option => option.textContent).filter(e => e !== "").join(',');
		}
	}

	init() {
		this.loadDatas();
		document.getElementById(`btnAdd${this.name}`).onclick = (e) => this.addItem();
		document.getElementById(`txt${this.name}`).onkeydown = (e) => {
			if (e.key === "Enter") this.addItem();
		};
		this.ulItem.onclick = (e) => {
		if (e.target.tagName === "B")
			{
				e.target.parentElement.remove();
				this.setDatas();
			}
		};
	}

	cleanItem(input) {
		return input.split(",").join("").split(":").join("")
	}
	
	addItem() {
		const elem = document.getElementById(`txt${this.name}`);
		if (!elem.value) { // if empty
			elem.setAttribute("placeholder", "Saisissez une valeur");
			setTimeout(() => {
				elem.setAttribute("placeholder", this.placeholder);
			}, 3000);
			return;
		}
		if (this.key) {
			delete this.newItem(cle.value)
			this.ulItem.append(this.newItem(cle.value + " : " + this.cleanItem(elem.value)));
		} else elem.value.split(',').filter(e => e !== "").forEach(e => {
			this.ulItem.append(this.newItem(e.trim()));
		})
		elem.value = "";
		this.setDatas()
	}
	
	newItem(text) {
		// create item
		const item = document.createElement("li");
		item.innerText = text;
		// add delete button
		item.appendChild(document.createElement("b"));
		//Add drag and drop functionality to the list items
		this.addDragDrop(item);
		return item;
	}

	loadDatas() {
		if (this.key) {
			Object.keys(this.values).forEach(key => {
				this.ulItem.appendChild(this.newItem(key + " : " + this.cleanItem(this.values[key])));
			});
		} else if (this.valuesElement.value.includes(',')) this.valuesElement.value.split(',').filter(e => e.trim() != "").forEach((a) =>
			this.ulItem.appendChild(this.newItem(a))
		); else this.ulItem.appendChild(this.newItem(this.valuesElement.value));
	}
	
	addDragDrop(item) {
		item.draggable = true;

		// Add a custom attribute to the element to indicate that it is a drag-drop item
		item.setAttribute("drag-drop-item", "");

		item.onclick = (e) => {
			const val = e.target.textContent.split(" : ");
			cle.value = val[0];
			getElement(`txt${this.name}`).value = val[1];
		};

		item.ondragstart = (e) => {
			window.draggedItem = e.target;
			e.dataTransfer.effectAllowed = "move";
		};

		item.ondragover = (e) => {
			e.preventDefault();
			if (!e.target.hasAttribute("drag-drop-item")) return;
			e.target.classList.add("drag-over");
		};

		item.ondragleave = (e) => {
			e.preventDefault();
			e.target.classList.remove("drag-over");
		};

		item.ondrop = (e) => {
			e.preventDefault();

			if (!e.target.hasAttribute("drag-drop-item")) return;
			e.target.classList.remove("drag-over");
			if (window.draggedItem === e.target) return;

			this.ulItem.removeChild(window.draggedItem,);
			this.ulItem.insertBefore(window.draggedItem, e.target);

			this.setDatas();
		};
	}
}