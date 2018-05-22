function saveFile() {
	const inputFile = document.querySelector("input");
	if(inputFile) _fileReader(inputFile);
}


function infos(event) {
	const name = document.getElementById('name');
	const size = document.getElementById('size');
	const infos = event.target.files[0];

	name.innerHTML = infos.name;
	size.innerHTML = _bytesToSize(infos.size);
}

function _bytesToSize(bytes) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return '0 Byte';
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 };

function _fileReader(input) {
	const reader = new FileReader();
	reader.onload = () => {
		const text = reader.result;
		 console.log('Tranformando json')
		 _transformJson(text).then(data => {
			console.log('Transformed');
			const jsonText = JSON.stringify(data);
			_save('teste.json', jsonText);
		 });
	}
	reader.readAsText(input.files[0]);
}

function _transformJson(json) {
	return new Promise((resolve, reject) => {
		const jsonParser = JSON.parse(json);
		let compare = null;
		const newObject = jsonParser.reduce((newObj, item, index) => {
			if(compare === item.Id) item.Id = new String(`${item.Id}${Math.floor(Math.random() * Math.floor(10))}`).toString();
			compare = item.Id;

			newObj[item.Id] = {
				"Id": item.Id,
				"Parametros": item.Parametros.reduce((pObj, pItem, pIndex) => {
					pObj[pItem.Nome] = pItem.Valor
					return pObj;
				}, {})
			}
			return newObj;
		}, {});

		if(newObject) resolve(newObject);
		else reject('Json Error');
	});
}

function _save(name, json) {
	const element = document.createElement('a');
	const data = "data:text/json;charset=utf-8," + encodeURIComponent(json);
	element.setAttribute('href', data);
	element.setAttribute('download', name);
	element.style.display = "none";
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

// const jsonStringToExport = JSON.stringify(newJson);
// const date = (new Date());
// const fileName =  `Json_Exported_In-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; 

// fs.writeFile(`./jsonExported/${fileName}.json`, jsonStringToExport, 'utf8', (err, data) => {
// 	if(err) return console.log("Errou => ", err);
// });