let _pageWidth = 595, _pageHeight = 842;
let _pageTopMargin = 57, _pageBottomMargin = 57, _pageLeftMargin = 57, _pageRightMargin = 57;
let _headerHeight = 35, _footerHeight = 43;
let _viewLeft = _pageLeftMargin, _viewTop = _pageTopMargin, _viewRight = _pageWidth - _pageRightMargin, _viewBottom = _pageHeight - _pageBottomMargin;
let _viewWidth = _pageWidth - _pageLeftMargin - _pageRightMargin, _viewHeight = _pageHeight - _pageTopMargin - _pageBottomMargin;
let _footerY = _pageHeight - _footerHeight;
let _fontName = "helvetica";
var _currentArticle = 0;
var _validArticles = 0;
var _pageY = 0;

var _now = new Date();
var _newsTitle = 'Untitled';
var _pageNr = 1;
var _pageCount = 0;

var exportStartDate = new Date();
var exportEndDate = new Date();

const wait = function(iMilliSeconds) {
    var counter= 0
        , start = new Date().getTime()
        , end = 0;
    while (counter < iMilliSeconds) {
        end = new Date().getTime();
        counter = end - start;
    }
}

const isLastPage = function() {
	pageItems = document.getElementsByClassName("pagination").item(0).getElementsByTagName("li");
	return pageItems.item(pageItems.length - 1).className.includes('disabled');
}

const isFirstPage = function() {
	pageItems = document.getElementsByClassName("pagination").item(0).getElementsByTagName("li");
	return pageItems.item(0).className.includes('disabled');
}

const clickNextPage = function() {
	pageItems = document.getElementsByClassName("pagination").item(0).getElementsByTagName("li");
	pageItems.item(pageItems.length - 1).getElementsByTagName("a").item(0).click();
}

const clickPrevPage = function() {
	pageItems = document.getElementsByClassName("pagination").item(0).getElementsByTagName("li");
	pageItems.item(0).getElementsByTagName("a").item(0).click();
}

const newPdf = function() {
	_now = new Date();
	_pageNr = 1;
	_pageCount = 1;
	_pageY = _viewTop;

	let jsPdfOptions = {
		"orientation": "portrait",
		"unit": "pt",
		"format": "a4",
		"putOnlyUsedFonts": true
	}

	var { jsPDF } = window.jspdf;
	var pdf = new jsPDF(jsPdfOptions);
	//writePageFooter(pdf);
	return pdf;
}

const newPage = function(pdf) {
	pdf.addPage();
	_pageNr++;
	_pageCount++;
	_pageY = _viewTop;
	//writePageFooter(pdf);
}

const writePageFooter = function(pdf) {
	pdf.setFontSize(10);
	pdf.setFont(_fontName, "normal");
	pdf.text(_viewLeft, _footerY, 'Scipio ' + _newsTitle + ', samengesteld op ' + _now.toLocaleString());
	pdf.text(_viewRight, _footerY, 'Pagina ' + _pageNr + " van " + _pageCount, 'right');
}

const savePdf = function(pdf) {
	console.log("savePdf");
	for (var pageNr = 1; pageNr <= +_pageCount; pageNr++) {
		_pageNr = pageNr;
		pdf.setPage(pageNr);
		writePageFooter(pdf);
	}
	pdf.save('Scipio ' + _newsTitle + ' ' + _now.toLocaleString().replaceAll(":","_") + '.pdf');
}

const newsExportButtonClickHandler = function() {
	console.log("newsExportButtonClickHandler");

	exportStartDate = new Date(document.getElementById("exportDateFromInput").value);
	exportStartDate.setHours(0,0,0,0);

	exportEndDate = new Date(document.getElementById("exportDateToInput").value);
	exportEndDate.setHours(0,0,0,0);

	console.log("exporting news from " + exportStartDate + " until " + exportEndDate);

	if (isFirstPage()) {
		pdf = newPdf();
		readPage(pdf);
	} else {
		setTimeout(function () {newsExportButtonClickHandler();}, 1000);
		clickPrevPage();
	}
}

const readPage = function(pdf) {
	console.log("readPage");
	tables = document.getElementsByTagName("table");
	lastTable = tables.item(tables.length-1);
	newsArticles = lastTable.getElementsByTagName("tr");
	_validArticles = 0;

	if (newsArticles.length > 1) {
		_currentArticle = 1;
		readCurrentArticleLine(pdf, newsArticles);
	}
}

const readPageDone = function(pdf) {
	if (isLastPage()) {
		savePdf(pdf);
	} else {
		setTimeout(function () {readPage(pdf);}, 1000);
		clickNextPage();
	}
}

const newsArticleIsValid = function(pdf, newsArticle) {
	if (newsArticle) {
		articleDateString = newsArticle.getElementsByTagName("td").item(2).innerText.replaceAll('Verlopen\n','').replaceAll('\n', ' ').replaceAll(',','');
		articleYear = articleDateString.split(' ')[3];
		articleMonth = articleDateString.split(' ')[2]
							.replaceAll('januari','01')
							.replaceAll('februari','02')
							.replaceAll('maart','03')
							.replaceAll('april','04')
							.replaceAll('mei','05')
							.replaceAll('juni','06')
							.replaceAll('juli','07')
							.replaceAll('augustus','08')
							.replaceAll('september','09')
							.replaceAll('oktober','10')
							.replaceAll('november','11')
							.replaceAll('december','12');
		articleDay = ('0' + articleDateString.split(' ')[1]).slice(-2);

		articleDate = new Date(articleYear+'-'+articleMonth+'-'+articleDay);
		articleDate.setHours(0,0,0,0);
		if (articleDate >= exportStartDate && articleDate <= exportEndDate) {
			return true;
		}

		// !newsArticle.getElementsByTagName("td").item(2).innerText.includes("Verlopen")
		
	}
	return false;
}

const readCurrentArticleLine = function(pdf) {
	console.log("readCurrentArticleLine: " + _currentArticle);
	tables = document.getElementsByTagName("table");
	lastTable = tables.item(tables.length-1);
	newsArticles = lastTable.getElementsByTagName("tr");
	newsArticle = newsArticles.item(_currentArticle);
	if (newsArticle) {
		if (newsArticleIsValid(pdf, newsArticle)) {
			_validArticles++;
			fillNewsPageWithLineContent(pdf);
		} else {
			continueAfterInvalidArticle(pdf);
		}
	} else {
		setTimeout(function () {readPageDone(pdf);}, 1000);
	}
}

const fillNewsPageWithLineContent = function(pdf) {
	console.log("fillNewsPageWithLineContent: " + _currentArticle + ", _pageY = " + _pageY);

	if (!newPageIfNeeded(pdf, 40)) {
		_pageY += 10;
		pdf.line(_viewLeft, _pageY, _viewRight, _pageY);
		_pageY += 20;
	}

	pdf.setFontSize(18);
	pdf.setFont(_fontName, "bold");
	articleTitle = newsArticle.getElementsByTagName("td").item(1).innerText;
	pdf.text(_viewLeft, _pageY, articleTitle);
	console.log("fillNewsPageWithLineContent: " + _currentArticle + ", articleTitle = " + articleTitle + ", _pageY = " + _pageY);
	_pageY += 18;

	pdf.setFontSize(10);
	pdf.setFont(_fontName, "normal");
	publicatie = newsArticle.getElementsByTagName("td").item(2).innerText;
	pdf.text(_viewLeft, _pageY, "Publicatiedatum: " + publicatie.replaceAll("\n"," "));
	console.log("fillNewsPageWithLineContent: " + _currentArticle + ", publicatie = " + publicatie + ", _pageY = " + _pageY);
	_pageY += 10;

	console.log("fillNewsPageWithLineContent: " + _currentArticle + ", newsArticle.click(), _pageY = " + _pageY);
	newsArticle.click();

	setTimeout(function () {fillNewsPageWithNewsContent(pdf);}, 1000);
}

const fillNewsPageWithNewsContent = function(pdf) {
	console.log("fillNewsPageWithNewsContent: " + _currentArticle + ", _pageY = " + _pageY);

	inleiding = document.getElementsByTagName("textarea").item(0).value;
	if (inleiding) {
		_pageY += 10;
		console.log("fillNewsPageWithNewsContent: " + _currentArticle + ", inleiding = " + inleiding + ", _pageY = " + _pageY);

		lines = pdf.setFontSize(12)
			.setFont(_fontName, "bold")
			.splitTextToSize(inleiding, _viewWidth);

		lineHeight = pdf.getFontSize() * pdf.getLineHeightFactor();
		for (let line in lines) {
			if (newPageIfNeeded(pdf, lineHeight)) {
				pdf.setFontSize(12).setFont(_fontName, "bold");
			}
			pdf.text(_viewLeft, _pageY, lines[line]);
			_pageY += lineHeight;
		}
	}

	bericht = document.getElementsByTagName("textarea").item(1).value;
	if (bericht) {
		_pageY += 10;
		console.log("fillNewsPageWithNewsContent: " + _currentArticle + ", bericht, _pageY = " + _pageY);

		bericht = bericht.replaceAll(/<li>/gi, "• ")
						.replaceAll(/<\/li>/gi, "")
						.replaceAll(/<ul>/gi, "")
						.replaceAll(/<\/ul>/gi, "\n")
						.replaceAll(/<br>/gi, "\n")
						.replaceAll(/<\/?b>/gi, "")
						.replaceAll(/<\/?i>/gi, "")
						.replaceAll(/<\/?u>/gi, "")
						.replaceAll(/<a href=[\'\"].+[\'\"]>/g, "")
						.replaceAll(/<\/a>/g,"");

		lines = pdf.setFontSize(12)
			.setFont(_fontName, "normal")
			.splitTextToSize(bericht, _viewWidth);

		lineHeight = pdf.getFontSize() * pdf.getLineHeightFactor();
		for (let line in lines) {
			if (newPageIfNeeded(pdf, lineHeight)) {
				pdf.setFontSize(12).setFont(_fontName, "normal");
			}
			pdf.text(_viewLeft, _pageY, lines[line]);
			_pageY += lineHeight;
		}
	}


	console.log("fillNewsPageWithNewsContent: " + _currentArticle + ", cancel.click(), _pageY = " + _pageY);
	document.getElementsByClassName("cancel").item(0).click();

	setTimeout(function () {afterFillNewsPageWithNewsContent(pdf);}, 1000);
}

const newPageIfNeeded = function(pdf, height) {
	if (_pageTopMargin + _viewHeight < _pageY + height) {
		newPage(pdf);
		return true;
	} else {
		return false;
	}
}

const afterFillNewsPageWithNewsContent = function(pdf) {
	console.log("afterFillNewsPageWithNewsContent: " + _currentArticle + ", _pageY = " + _pageY);

	_currentArticle++;

	setTimeout(function () {readCurrentArticleLine(pdf);}, 1000);
}

const continueAfterInvalidArticle = function(pdf) {
	_currentArticle++;
	setTimeout(function () {readCurrentArticleLine(pdf);}, 250);
}

const addNewsExportButton = function() {
	let addNewsButtons = document.querySelectorAll("button[ng-click='openNewsItem()']");

	let existingButton = document.getElementById("newsExportButton");
	if (!existingButton && addNewsButtons.length > 0) {
		_newsTitle = document.getElementsByClassName("page-header").item(0).innerText;

		rowList = document.getElementsByClassName("row");
		lastRow = rowList.item(rowList.length - 1);
		panelBody = lastRow.parentElement;

		exportRow = document.createElement("div");
		exportRow.setAttribute("id", "exportRow");
		exportRow.setAttribute("class","row");
		panelBody.insertBefore(exportRow, panelBody.children[1]);

		exportColumn = document.createElement("div");
		exportColumn.setAttribute("id", "exportColumn");
		exportColumn.setAttribute("class","col-md-6");
		exportRow.appendChild(exportColumn);

		exportBtnGroup = document.createElement("div");
		exportBtnGroup.setAttribute("id", "exportBtnGroup");
		exportBtnGroup.setAttribute("class","btn-group");
		exportColumn.appendChild(exportBtnGroup);


		exportDateFromLabel = document.createElement("label");
		exportDateFromLabel.setAttribute("for", "exportDateFromInput");
		exportDateFromLabel.innerText = "Datum vanaf:";

		exportDateFromInput = document.createElement("input");
		exportDateFromInput.setAttribute("id", "exportDateFromInput");
		exportDateFromInput.setAttribute("type", "date");

		exportDateToLabel = document.createElement("label");
		exportDateToLabel.setAttribute("for", "exportDateToInput");
		exportDateToLabel.innerText = "Datum tot en met:";

		exportDateToInput = document.createElement("input");
		exportDateToInput.setAttribute("id", "exportDateToInput");
		exportDateToInput.setAttribute("type", "date");

		newsExportButton = document.createElement("button");
		newsExportButton.setAttribute("id", "newsExportButton");
		newsExportButton.setAttribute("class","button primary");
		newsExportButton.innerText = "Exporteer " + _newsTitle + " als pdf";
		newsExportButton.addEventListener("click", newsExportButtonClickHandler);

		exportBtnGroup.appendChild(exportDateFromLabel);
		exportBtnGroup.appendChild(exportDateFromInput);
		exportBtnGroup.appendChild(exportDateToLabel);
		exportBtnGroup.appendChild(exportDateToInput);
		exportBtnGroup.appendChild(newsExportButton);

		today = new Date();
		endDate = new Date();
		endDate.setDate(today.getDate() - today.getDay());
		startDate = new Date();
		startDate.setDate(endDate.getDate() - 13);

		document.getElementById("exportDateFromInput").value = startDate.toISOString().slice(0,10);
		document.getElementById("exportDateToInput").value = endDate.toISOString().slice(0,10);
	}
}