document.addEventListener("DOMContentLoaded", function () {
	const table = new JsonTable({
		jsonUrl: window.location.origin + "/passeports",
		printUrl: "/passeport/",
		container: "#jsonTable",
		globalSearch: "#globalSearch",
		pagination: "#pagination",
		print: true,
		see: true,
		columns: structure,
        menuOptions: [
            {
                title : "Echantillons du passeport",
                url: "echantillons.html?passeport=",
            }
        ]


		// columns: structure
	});
});