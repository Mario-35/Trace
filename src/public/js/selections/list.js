let id = 0;
document.addEventListener("DOMContentLoaded", function () {
	const table = new JsonTable({
		jsonUrl: "",
		addUrl: `${window.location.origin}/echantillon/identification/`,
		editUrl: "/echantillon-add.html",
		printUrl: "/echantillon/",
		container: "#jsonTable",
		globalSearch: "",
		pagination: "#pagination",
		select: true,
		columns: structure 
	});
});