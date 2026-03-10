class editingList {	
	constructor(element, message, placeholder, values) {
		this.name = element.id.replace('List', '');
		this.valuesElement = document.getElementById(this.name);
		values = values || this.valuesElement.value;
		this.placeholder = placeholder;
		element.innerHTML = `
		<label for="addCleEtat">${message} </label>
			<div class="listbox-area">
			<controls>
				<input id="txt${this.name}" class="txtTodo" placeholder="${placeholder}" />
				<button id="btnAdd${this.name}" class="btnAdd">Add</button>
			</controls>
			<ul id="ul${this.name}" class="ulListes"></ul>
		</div>`;
		this.ulItem = document.getElementById(`ul${this.name}`);
		this.valuesElement.value = values;
		this.init();
	}

	setDatas() {
		const tmpDatas =  Array.from(this.ulItem .querySelectorAll('li')).map(option => option.textContent);
		this.valuesElement.value = tmpDatas.filter(e => e !== "").join(',');
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

	addItem() {
		const elem = document.getElementById(`txt${this.name}`);
		if (!elem.value) { // if empty
			elem.setAttribute("placeholder", "Saisissez une valeur");
			setTimeout(() => {
				elem.setAttribute("placeholder", this.placeholder);
			}, 3000);
			return;
		}
		elem.value.split(',').filter(e => e !== "").reverse().forEach(e => {
			this.ulItem.prepend(this.newItem(e.trim()));
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
		this.valuesElement.value.split(',').filter(e => e.trim() != "").forEach((a) =>
			this.ulItem.appendChild(this.newItem(a))
		);
	}
	
	addDragDrop(item) {
		item.draggable = true;

		// Add a custom attribute to the element to indicate that it is a drag-drop item
		item.setAttribute("drag-drop-item", "");

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

		this.valuesElement.value = Array.from(this.ulItem
		.querySelectorAll('li')).map(option => option.textContent).filter(e => e !== "").join(',');
			this.setDatas();
		};
	}
}