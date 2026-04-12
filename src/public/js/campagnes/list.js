document.addEventListener("DOMContentLoaded", function () {
	const table = new JsonTable({
		jsonUrl: window.location.origin + "/list/campagnes",
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
                title : "Echantillons de cette campagne",
                url: "echantillons.html?filter=",
            }
        ]
	});
});