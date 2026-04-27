let id = 0;
document.addEventListener("DOMContentLoaded", function () {
	const table = new JsonTable({
		jsonUrl: window.location.origin + "/list/selections",
		editUrl: "",
		printUrl: undefined,
		container: "#jsonTable",
		globalSearch: "#globalSearch",
		pagination: "#pagination",
		print: false,
		edit: true,
		columns: structure,
		menuOptions: [
            {
                title : "Selections d'échantillons",
                url: "selections.html?filter=",
            }
        ]
	});
});