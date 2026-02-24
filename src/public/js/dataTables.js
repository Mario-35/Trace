document.querySelector("html").setAttribute("data-bs-theme", "dark");

class JsonTable {
	mariol = [];
	constructor(options) {
		this.jsonUrl = options.jsonUrl || "";
		this.addUrl = options.addUrl || "";
		this.seeUrl  = options.seeUrl || "";
		this.editUrl = options.editUrl || undefined;
		this.printUrl = options.printUrl || undefined; // printUrl icon 
		this.perPageSelect = [25, 50, 100, 500, 1000];
		this.rowsPerPage = this.perPageSelect[0];
		this.container = document.querySelector(options.container || "#jsonTable");
		this.globalSearchInput = document.querySelector(
			options.globalSearch || "#globalSearch"
		);
		this.paginationContainer = document.querySelector(
			options.pagination || "#pagination"
		);
		this.columns = options.columns || []; // Array of objects defining column settings
		this.see = options.see || false; // see icon 
		this.select = options.select || false; // edit icon 
		this.toastWrapper = options.toastWrapper || ""; // Added toastWrapper
		this.toastBody = options.toastBody || ""; // Added toastBody

		this.data = options.data || [];
		this.currentPage = 1;
		this.sortColumn = null;
		this.sortOrder = "asc";
		this.filteredPages = 0;
		this.filteredData = [];

		this.init();
	}


	async init() {
		await this.fetchData();
		this.renderTable();
		this.addGlobalSearchListener();
	}

	async postStore() {
		const corespondance = {};
		const elems = document.querySelectorAll('.excel-control');
        elems.forEach((elem) => {
			if (elem.value.includes("|")) {
				const names = elem.value.split("|");
				corespondance[names[1]] = names[0];
			}
        });
		// converti les echantillons en chiffres
		if (corespondance["echantillon"])
			this.filteredData.forEach(e => e[corespondance["echantillon"]] = +e[corespondance["echantillon"]] );

		const datas = {
			datas: this.filteredData,
			columns: corespondance
		};
        const response = await fetch(window.location.origin + `/excel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datas),
        });		
		return await response.text();
	}

	async addData(element) {
		try {
			const response = await fetch(this.addUrl + element.value);
			const data = await response.json();
			this.data.push(data);
			this.filteredData = [...this.data];	
			this.renderTable();
			element.value = "";
		} catch (error) {
			console.error("Error fetching JSON data:", error);
		}
	}

	async fetchData() {
		if (this.jsonUrl.trim() === "") {
			this.filteredData = [...this.data];			
			if (!this.addUrl ||this.addUrl.trim() == "") return;

						// change region value
			if (getElement('addSample'))
				getElement('addSample').addEventListener('keydown', async (event) => {
					// if return and france
					if(event.keyCode == 13) {
						await this.addData(event.target);
					}
				});
			
			// change region value
			// getElement('addSample').addEventListener('change', async (event) => {
			// 	await this.addData(event.target.value);
			// });

			return;
		}
		try {
			const response = await fetch(this.jsonUrl);
			this.data = await response.json();
			this.filteredData = [...this.data];
		} catch (error) {
			console.error("Error fetching JSON data:", error);
		}
	}

	// async post_Datas(url, datas) {
	// 	try {
	// 		const response = await fetch(encodeURI(url), {
	// 			method: 'POST',
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify(datas),
	// 		});
	// 		return await response.json();		
	// 	} catch (error) {
	// 		log(error);
	// 		return undefined
	// 	}
	// }

        // Per Page Select
    createPerPageSelect() {
            // perPageSelect.innerHTML = "";
            // var select = document.createElement("select");
			// select.className ="form-control";
			// select.id ="essai";
			// [25, 50, 100, 500, 1000].forEach(val => {
			// 	var opt = document.createElement('option');
			// 	opt.value = val;
			// 	opt.innerHTML = val;
			// 	if (getElement("essai") && val === essai.value)
			// 		opt.setAttribute("selected", "selected");
			// 	select.appendChild(opt);
			// });
			
			// perPageSelect.appendChild(select);

			perPageSelect.addEventListener("change", (e) => {
				this.rowsPerPage = e.target.value;
				this.renderTable();
			});
}

	renderTable(which = "all") {
		if (which == "all") {
			this.renderHeader();
			this.renderRows();
			this.createPerPageSelect();
			this.renderPagination();
		} else {
			this.renderRows();
			this.renderPagination();
			this.createPerPageSelect();
		}
		// infos.innerHTML = `${this.filteredData.length} sur ${this.data.length} total`
	}

	headerAttribute() {
		return 'white-space: nowrap; width: 1%; font-weight: lighter;font-size: 14px;';
	}

	renderHeader() {
		const tableHeader = this.container.querySelector("thead");
		tableHeader.innerHTML = "<tr></tr>";
		const headerRow = tableHeader.querySelector("tr");
		if (this.editUrl)
			headerRow.insertAdjacentHTML("afterbegin", `<th><button class="btn btn-success icon_edit btn-sm" id="editAll"></button></th>`);
		if (this.select === true) 
			headerRow.insertAdjacentHTML("afterbegin", `<th style="${this.headerAttribute()}"><label>Filter</label><select id="id-select" class="form-control excel-control"> <option value="">tout</option> <option value="true">✔️️</option> <option value="false">❌</option> </select></th>`);
		this.columns.filter(e => e.key.toUpperCase() !== 'ID').forEach((column) => {
			const th = document.createElement("th");
			const label = document.createElement("label");
			label.innerHTML = column.title || column.key;
			th.appendChild(label);
			switch (column.searchType) {
				case "button":
					if (column.header) {
						const buttonEdit = document.createElement("button");
						buttonEdit.className = "btn btn-success btn-sm";
						buttonEdit.innerHTML = '<i title="editer toute la selection" class="bi bi-eye" id="seeAll"></i>';
						th.appendChild(buttonEdit);					
					}

				break;
				case "select":
					const selectSelect = document.createElement("select");
					selectSelect.className = "form-control";
					selectSelect.innerHTML = `<option value="">Tous</option>`;
					const uniqueValues = [...new Set(this.data.map((row) => row[column.key]))];
					uniqueValues.forEach((value) => {
						const option = document.createElement("option");
						option.textContent = value;
						option.value = value;
						selectSelect.appendChild(option);
					});
					selectSelect.addEventListener("change", (e) =>
						this.filterColumn(column.key, e.target.value)
					);
					th.appendChild(selectSelect);					
					break;
				case "excel":
					th.setAttribute("style", this.headerAttribute());
					const selectExcel = document.createElement("select");
					selectExcel.className = "form-control";
					selectExcel.classList.add("excel-control");
					selectExcel.innerHTML = `<option value="">Aucun</option>`;
					Object.keys(_CONFIGURATION.stickerElements).forEach((value) => {
						const option = document.createElement("option");
						option.textContent = value;
						option.value = column.key + "|" +value;
						selectExcel.appendChild(option);
					});
					th.appendChild(selectExcel);	
					
					selectExcel.addEventListener("change", (e) => {
						if (e.target.value)
						e.target.classList.add("something");
						else e.target.classList.remove("something");
						this.filterBlankColumn();
					});
					break;
				case "boolean":
					const selectBoolean = document.createElement("select");
					selectBoolean.className = "form-control";
					selectBoolean.innerHTML = `<option value="">Etat</option><option value="true">✔️️</option> <option value="false">❌</option>`;
					selectBoolean.addEventListener("change", (e) =>
						this.filterColumn(column.key, e.target.value)
					);
					th.appendChild(selectBoolean);					
					break;				
				default:
					const input = document.createElement("input");
					input.type = "text";
					input.className = "form-control";
					input.placeholder = `${column.key}`;
					input.addEventListener("input", (e) =>
						this.filterColumn(column.key, e.target.value)
					);
					th.appendChild(input);					
					break;
			}
			headerRow.appendChild(th);
		});
		if (this.printUrl) 
			headerRow.insertAdjacentHTML("beforeend", `<th><button class="btn btn-success icon_print btn-sm" id="printAll"></button></th>`);
		let elem = getElement("editAll");
		if (elem) elem.addEventListener("click", async (e) => {
        	const temp = await this.postDatas(window.location.origin + '/selection', {ids: this.filteredData.map(e => e.id)});
			if (temp) open(this.editUrl + "?selection=" + temp[0].id, self); 
		});		
		elem = getElement("printAll");
		if (elem) elem.addEventListener("click", async (e) => {
        	const temp = await this.postDatas(window.location.origin + '/selection', {ids: this.filteredData.map(e => e.id)});
			if (temp) open(window.location.origin + '/print/' + "selection/" + temp[0].id, self);   
		});		
	}

	renderRows() {
		const tableBody = this.container.querySelector("tbody");
		tableBody.innerHTML = "";
		const start = (this.currentPage - 1) * this.rowsPerPage;
		const end = start + this.rowsPerPage;
		let rows = [...this.filteredData];

		// // Sorting
		// if (this.sortColumn) {
		// 	rows.sort((a, b) => {
		// 		if (this.sortOrder === "asc")
		// 			return a[this.sortColumn] > b[this.sortColumn] ? 1 : -1;
		// 		return a[this.sortColumn] < b[this.sortColumn] ? 1 : -1;
		// 	});
		// }

		// Paging
		const totalPages = Math.ceil(rows.length / this.rowsPerPage);
		this.filteredPages = totalPages;


		rows.slice(start, end).forEach((row) => {
			const tr = document.createElement("tr");
			tr.id = row.id;
			if (this.editUrl)
			tr.insertAdjacentHTML(
				"afterbegin",
				`<td><button class="btn btn-primary btn-sm icon_edit edit-btn"></button></td>`
			); else if (this.select === true)
			tr.insertAdjacentHTML(
				"afterbegin",
				`<td><input class="select-btn" type="checkbox" ${String(row.selected) == 'true' ? 'checked' : ''} data-row="${row.id}"></td>`
			);
			Object(this.columns.filter(e => e.key.toUpperCase() !== 'ID')).forEach((column) => {	
				const key = column.key;	;
				if (!["selected"].includes(key)) {
					const td = document.createElement("td");
					const tmp = this.columns.find((col) => col.key === key);
					if (tmp) {
						switch (tmp.searchType) {
							case 'button':
								td.innerHTML = `<a href="${tmp.url + row.id}" class="btn btn-primary btn-sm ${tmp.icon}" role="button"></a> `;
								break;								
							case 'date':
								td.textContent = row[key].split('T')[0] 
								break;
							case 'boolean':
								td.textContent = row[key] === true ? '✔️️' : '❌';
								break;						
							default:
								td.textContent = row[key];
								break;
						}
					} else td.textContent = row[key];
					tr.appendChild(td);
				}
			});

			if (this.printUrl) 
				tr.insertAdjacentHTML(
					"beforeend",
					`<td"><button class="btn btn-primary btn-sm icon_print print-btn"></button></td>`
				);

			tableBody.appendChild(tr);
		});
		
		if (this.editUrl) this.container
			.querySelectorAll(".edit-btn")
			.forEach((btn) =>
				btn.addEventListener("click", (e) => open(this.editUrl + "?id=" + e.target.parentNode.closest('tr').id, self))
			); 

		if (this.select === true) {
				document.getElementById("id-select").addEventListener("change", (e) => this.filterSelected(e.target.value ));
				this.container
			.querySelectorAll(".select-btn")
			.forEach((btn) =>  
				btn.addEventListener("click", (e) => {
					const id = +e.target.getAttribute("data-row");
					this.filteredData = this.data.filter((row) => row.id == id )[0].selected = e.target.checked

				} 
				)
			);
		} 
		
		if (this.printUrl) this.container
			.querySelectorAll(".print-btn")
			.forEach((btn) =>
				btn.addEventListener("click", (e) => 
					open(window.location.origin + '/print' + this.printUrl + e.target.parentNode.closest('tr').id, self))
			);
	}

	filterSelected(value) {
		value = String(value);
		if (value === "") {
			this.filteredData = [...this.data];
		} else {
			this.filteredData = this.data.filter((row) => String(row.selected) == value);
		}
		this.currentPage = 1; // Reset to first page
		this.renderTable("rows");		
	}

	renderPagination() {
		this.paginationContainer.innerHTML = "";
		const totalPages = this.filteredPages;
		const currentPage = this.currentPage;
		const maxVisiblePages = 6; // Adjust this number as needed

		if (totalPages <= maxVisiblePages) {
			// If total pages are less than or equal to maxVisiblePages, show all pages
			for (let i = 1; i <= totalPages; i++) {
				this.renderPageLink(i, currentPage);
			}
		} else {
			// Determine which pages to display based on current page
			let pagesToShow = [];

			// Always show first 2 pages
			pagesToShow.push(1);
			pagesToShow.push(2);

			// Calculate mid range around current page
			const leftRange = Math.max(currentPage - 2, 3); // Always show at least 2 pages before
			const rightRange = Math.min(currentPage + 2, totalPages - 2); // Always show at least 2 pages after

			// Show range of pages
			for (let i = leftRange; i <= rightRange; i++) {
				pagesToShow.push(i);
			}

			// Always show last 2 pages
			pagesToShow.push(totalPages - 1);
			pagesToShow.push(totalPages);

			// Render the pages with "..." as needed
			for (let i = 0; i < pagesToShow.length; i++) {
				const pageNumber = pagesToShow[i];
				if (i > 0 && pageNumber - pagesToShow[i - 1] > 1) {
					// There's a gap between pages, add "..."
					this.renderPaginationGap();
				}
				this.renderPageLink(pageNumber, currentPage);
			}
		}
	}

	renderPageLink(pageNumber, currentPage) {
		const li = document.createElement("li");
		li.className = "page-item";
		if (pageNumber === currentPage) {
			li.classList.add("active");
		}

		const a = document.createElement("a");
		a.className = "page-link";
		a.textContent = pageNumber;
		a.href = "#";
		a.addEventListener("click", (e) => {
			e.preventDefault();
			this.currentPage = pageNumber;
			this.renderRows();
			this.renderPagination();
			this.updateActivePage(pageNumber);
		});

		li.appendChild(a);
		this.paginationContainer.appendChild(li);
	}

	renderPaginationGap() {
		const li = document.createElement("li");
		li.className = "page-item disabled";
		const span = document.createElement("span");
		span.className = "page-link";
		span.textContent = "...";
		li.appendChild(span);
		this.paginationContainer.appendChild(li);
	}

	updateActivePage(page) {
		const paginationItems = this.paginationContainer.querySelectorAll(
			".page-item"
		);
		paginationItems.forEach((item) => {
			item.classList.remove("active");
			const link = item.querySelector(".page-link");
			if (link.textContent === String(page)) {
				item.classList.add("active");
			}
		});
	}

	addGlobalSearchListener() {
		if (this.globalSearchInput) {
			this.globalSearchInput.addEventListener("input", (e) =>
				this.filterGlobal(e.target.value)
			);
		}
	}

	getRow(id) {
		this.filteredData = this.data.filter((row) =>
			row.id === id
		);
		this.currentPage = 1;
		this.renderTable();
	}

	filterGlobal(value) {
		const lowerValue = value.toLowerCase();
		this.filteredData = this.data.filter((row) =>
			Object.values(row).some((field) =>
				String(field).toLowerCase().includes(lowerValue)
			)
		);
		this.currentPage = 1;
		this.renderTable();
	}

	// remove all blank or non present column from seleted excel
	filterBlankColumn() {		
		const listCols = [];
		const elems = document.querySelectorAll('.excel-control');
		elems.forEach(elem => {
			if (elem.value !== "") listCols.push(elem.value);
		});
		this.filteredData = 
		this.data.filter((item) => {
			let good = true;
			listCols.forEach(listCol => {
				const nameSplit = listCol.split("|");
				// exclut les blancs et null
				if (!item[nameSplit[0]] || item[nameSplit[0]] === null) good = false;
				// garde que les nombre en cas de colonne echantillon
				if (nameSplit[1] === "echantillon" && isNaN(item[nameSplit[0]]) === true) good = false; 
			});
			if (good === true) return item;
		})
		this.currentPage = 1; // Reset to first page
		this.renderTable("rows");
	}

	filterColumn(key, value) {
		// Filter data based on specific column key and input value
		// Update filteredData based on current search criteria
		if (value === "") {
			// If search value is empty, reset to original data
			this.filteredData = [...this.data];
		} else {
			// Perform filtering based on the key and value
			const lowerCaseValue = value.toLowerCase();

			this.filteredData = this.data.filter((row) => {
				if ( this.columns.find((col) => col.key === key && col.searchType === "select") ) {
					// For select dropdown filtering
					return row[key].toLowerCase() === lowerCaseValue;
				} else if ( this.columns.find((col) => col.key === key && col.searchType === "boolean") ) {
					return row[key] === (value === 'true') ? true : false;
				} else {
					// For text input filtering
					return row[key].toLowerCase().includes(lowerCaseValue);
				}
			});
		}

		// Re-render table rows and pagination after filtering
		this.currentPage = 1; // Reset to first page
		this.renderTable("rows");
	}

	adjustTfootSearchFields() {
		// Adjust tfoot search fields
		const tfoot = this.container.querySelector("tfoot");
		// If edit column is at the start, move tfoot search fields over by 1
		const th = document.createElement("th");
		th.textContent = ""; // Adjust as needed based on your table structure
		tfoot.insertBefore(th, tfoot.firstElementChild); // Adjust based on your specific structure
	}

	toggleSort(column) {
		if (this.sortColumn === column) {
			this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
		} else {
			this.sortColumn = column;
			this.sortOrder = "asc";
		}
		this.renderRows();
	}
}


