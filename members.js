const getFirstLine = function() {
	list = document.getElementById("main").getElementsByTagName("table").item(0).getElementsByTagName("tbody").item(0).getElementsByTagName("tr");
	return getLine(list, 1);
}

const getLine = function(list, lineId) {
	line = list.item(lineId);
	lineCells = line.getElementsByTagName("td");

	nameItems = lineCells.item(3).textContent.trim().replaceAll("\t","").replaceAll("\n\n", "\n").split("\n");

	name = lineCells.item(3).innerText.split("\n")[0];
	status = lineCells.item(3).innerText.split("\n")[1];
	adres = lineCells.item(4).innerText.replaceAll("\n",", ").replaceAll("\r", ", ");
	if (lineCells.item(5).innerText.split("\n").length == 1) {
		email = "";
		telefoon = lineCells.item(5).innerText.split("\n")[0];
	} else {
		email = lineCells.item(5).innerText.split("\n")[0];
		telefoon = lineCells.item(5).innerText.split("\n")[1];
	}
	if (telefoon.includes("@")) {
		newEmail = telefoon;
		telefoon = email;
		email = newEmail;
	}
	regel = name + "\t" + status + "\t" + adres + "\t" + email + "\t" + telefoon;
	return regel;
}

const getCurrentPage = function() {
	list = document.getElementById("main").getElementsByTagName("table").item(0).getElementsByTagName("tbody").item(0).getElementsByTagName("tr");
	page = "";
	for (var lineId = 1; lineId < list.length; lineId++) {
		page += getLine(list, lineId) + "\n";
	}
	console.log(page);
	return page;
}

const logLineCount = function() {
	mainBody = document.getElementById("main");
	if (mainBody) {
		table = mainBody.getElementsByTagName("table").item(0);
		if (table) {
			list = table.getElementsByTagName("tbody").item(0).getElementsByTagName("tr");
			console.log("ListCount: " + list.length);
		} else {
			console.log("ListCount: Table does not exist");
		}
	} else {
		console.log("ListCount: Main Body does not exist");
	}
}

const getAllPages = function() {
	pageCount = document.getElementsByTagName("dir-pagination-controls")[0].getElementsByTagName("li").length - 2;
	content = "Naam\tStatus\tAdres\tEmail\tTelefoon\n";
	for (var pageId = 1; pageId <= pageCount; pageId++) {
		console.log("Now going for page " + pageId);
		document.getElementsByTagName("dir-pagination-controls")[0].getElementsByTagName("li")[pageId].getElementsByTagName("a")[0].click();
		console.log("FirstLine: " + getFirstLine());
		content += getCurrentPage();
		console.log("After Clicking on page " + pageId);
	}
	console.log(content);
	return content;
}

const exportButtonClickHandler = function() {
	let content = getAllPages();

	let filterSelector = document.querySelectorAll("select[ng-model='filterMembers.selectedStatus']").item(0);
	let filterIndex = filterSelector.selectedIndex;
	let filterText = filterSelector[filterIndex].innerText;

	let fileName = "Scipio leden export - " + filterText + " - " + new Date().toLocaleString().replaceAll(":","_") + ".csv"
	const file = new File([content], fileName, {type: 'text/plain'});

	const link = document.createElement('a')
	const url = URL.createObjectURL(file)

	link.href = url
	link.download = file.name
	document.body.appendChild(link)
	link.click()

	document.body.removeChild(link)
	window.URL.revokeObjectURL(url)
}

const addMemberExportButton = function() {
	let copyButtons = document.getElementsByClassName("fa-copy");
	let existingButton = document.getElementById("exportButton");
	if (!existingButton && copyButtons.length > 0) {
		copyButtonLine = copyButtons[0].parentElement.parentElement;
		exportButton = document.createElement("button");
		exportButton.innerText = "Exporteer lijst";
		exportButton.id = "exportButton";
		exportButton.addEventListener("click", exportButtonClickHandler);
		copyButtonLine.appendChild(exportButton);
	}
}