// Foctions interogartion api
getDatas = async (url, text) => {
	try {
		const response = await fetch(encodeURI(url), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.status >= 400 ? undefined : await text ? response.text() : response.json();
	} catch (error) {
		log(error);
		return undefined
	}
};

postDatas = async (url, datas) => {
	try {
		const response = await fetch(encodeURI(url), {
			method: 'POST',
            headers: {
				"Content-Type": "application/json",
            },
            body: JSON.stringify(datas),
		});
		return response.status >= 300 ? undefined : await response.json();
	} catch (error) {
		log(error);
		return undefined
	}
};


function loadApi(element) {
	let a = element.children[0].innerText;
	const lol = {
		"identification/:id": 'identification/2402202604360001',
		":id": 1
	}
	Object.keys(lol).forEach(key => a = a.replace(key, lol[key]));
	url.value = a;
}