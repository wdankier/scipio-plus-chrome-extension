let _pageWidth = 595, _pageHeight = 842;
let _pageTopMargin = 42, _pageBottomMargin = 42, _pageLeftMargin = 42, _pageRightMargin = 42;
let _headerHeight = 35, _footerHeight = 43;
let _viewLeft = _pageLeftMargin, _viewTop = _pageTopMargin, _viewRight = _pageWidth - _pageRightMargin, _viewBottom = _pageHeight - _pageBottomMargin;
let _viewWidth = _pageWidth - _pageLeftMargin - _pageRightMargin, _viewHeight = _pageHeight - _pageTopMargin - _pageBottomMargin;
let _footerY = _pageHeight - _footerHeight;
let _fontName = "helvetica";

let _fontSizeFooter = 8;
let _fontTypeFooter = "italic";

let _fontSizeTitle = 14; // was 16
let _fontTypeTitle = "bold"

let _fontSizeArticleTitle = 12; // was 14
let _fontTypeArticleTitle = "bold"

let _fontSizePublicationDate = 8;
let _fontTypePublicationDate = "normal"

let _fontSizeArticleIntro = 11; // was 12
let _fontTypeArticleIntro = "bold"

let _fontSizeArticleContent = 11; // was 12
let _fontTypeArticleContent = "normal"

let _drawLayoutLines = false;

let _maxPage = 3;

var _currentArticle = 0;
var _currentArticlePage = 0;
var _currentPageName = '?';
var _validArticles = 0;
var _pageY = 0;

var _now = new Date();
var _newsTitle = 'Untitled';
var _pageNr = 1;
var _pageCount = 0;

var _exportStartDate = new Date();
var _exportEndDate = new Date();

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
	console.log("CLICK NEXT PAGE");
	pageItems = document.getElementsByClassName("pagination").item(0).getElementsByTagName("li");
	pageItems.item(pageItems.length - 1).getElementsByTagName("a").item(0).click();
	_currentArticlePage = _currentArticlePage + 1;
}

const clickPrevPage = function() {
	console.log("CLICK PREV PAGE");
	pageItems = document.getElementsByClassName("pagination").item(0).getElementsByTagName("li");
	pageItems.item(0).getElementsByTagName("a").item(0).click();
	_currentArticlePage = _currentArticlePage - 1;
}

const clickFirstPage = function() {
	console.log("CLICK FIRST PAGE");
	pageItems = document.getElementsByClassName("pagination").item(0).getElementsByTagName("li");
	pageItems.item(1).getElementsByTagName("a").item(0).click();
	_currentArticlePage = 1;
}

const getCurrentPageName = function() {
	let pagination = document.getElementsByClassName("pagination");
	if (pagination.length > 0) {
		activeElements = pagination.item(0).getElementsByClassName("active");
		if (activeElements.length > 0) {
			return activeElements.item(0).getElementsByTagName("a").item(0).text;
		}
	}
	return '?';
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
	drawViewBox(pdf);
	return pdf;
}

const newPage = function(pdf) {
	pdf.addPage();
	drawViewBox(pdf);
	_pageNr++;
	_pageCount++;
	_pageY = _viewTop;
}

const drawViewBox = function(pdf) {
	if (_drawLayoutLines) {
		pdf.setDrawColor(0,0,255);
		pdf.line(_viewLeft, _viewTop, _viewRight, _viewTop); // Top line
		pdf.line(_viewLeft, _viewBottom, _viewRight, _viewBottom); // Bottom line
		pdf.line(_viewLeft, _viewTop, _viewLeft, _viewBottom); // Left line
		pdf.line(_viewRight, _viewTop, _viewRight, _viewBottom); // Right line
		pdf.setDrawColor(0,0,0);
	}
}

const drawBlackLine = function(pdf) {
	pdf.setDrawColor(0,0,0);
	pdf.line(_viewLeft, _pageY, _viewRight, _pageY);
	pdf.setDrawColor(0,0,0);
}

const drawGreyLine = function(pdf) {
	pdf.setDrawColor(127,127,127);
	pdf.line(_viewLeft, _pageY, _viewRight, _pageY);
	pdf.setDrawColor(0,0,0);
}

const drawRedLine = function(pdf) {
	if (_drawLayoutLines) {
		pdf.setDrawColor(255,0,0);
		pdf.line(_viewLeft, _pageY, _viewRight, _pageY);
		pdf.setDrawColor(0,0,0);
	}
}

const drawGreenLine = function(pdf) {
	if (_drawLayoutLines) {
		pdf.setDrawColor(0,255,0);
		pdf.line(_viewLeft, _pageY, _viewRight, _pageY);
		pdf.setDrawColor(0,0,0);
	}
}

const drawBlueLine = function(pdf) {
	if (_drawLayoutLines) {
		pdf.setDrawColor(0,0,255);
		pdf.line(_viewLeft, _pageY, _viewRight, _pageY);
		pdf.setDrawColor(0,0,0);
	}
}

const setFont = function(pdf, fontSize, fontStyle) {
	pdf.setFont(_fontName, fontStyle).setFontSize(fontSize);
	return pdf.getFontSize() * pdf.getLineHeightFactor();
}

const writePageFooter = function(pdf) {
	var footerLineHeight = setFont(pdf, _fontSizeFooter, _fontTypeFooter);
	_pageY = _footerY;
	drawGreyLine(pdf);
	_pageY += footerLineHeight;
	pdf.text(_viewLeft, _pageY, 'Scipio ' + _newsTitle + ', samengesteld op ' + _now.toLocaleString());
	pdf.text(_viewRight, _pageY, 'Pagina ' + _pageNr + " van " + _pageCount, 'right');
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

	_exportStartDate = new Date(document.getElementById("exportDateFromInput").value);
	_exportStartDate.setHours(0,0,0,0);

	_exportEndDate = new Date(document.getElementById("exportDateToInput").value);
	_exportEndDate.setHours(0,0,0,0);

	console.log("exporting news from " + _exportStartDate + " until " + _exportEndDate);

	if (isFirstPage()) {
		_busyExporting = true;
		_currentArticlePage = 1;
		pdf = newPdf();
		writeDocumentTitle(pdf);
		readPage(pdf);
	} else {
		setTimeout(function () {newsExportButtonClickHandler();}, 1000);
		clickPrevPage();
	}
}

const getArticlesTable = function() {
	var tables = document.getElementsByTagName("table");
	return tables.item(tables.length-1);
}

const getNewsArticles = function() {
	var articlesTable = getArticlesTable();
	return articlesTable.getElementsByTagName("tr");
}

const getCurrentNewsArticle = function() {
	var newsArticles = getNewsArticles();
	return newsArticles.item(_currentArticle);
}

const readPage = function(pdf) {
	_currentPageName = getCurrentPageName();
	console.log("readPage: " + _currentArticlePage + " '"+ getCurrentPageName() + "'");
	newsArticles = getNewsArticles();
	console.log("newsArticles.length = " + newsArticles.length);
	_validArticles = 0;

	if (newsArticles.length > 1) {
		_currentArticle = 1;
		readCurrentArticleLine(pdf);
	}
}

const readCurrentArticleLine = function(pdf) {
	console.log("********************************************************************************");
	console.log("readCurrentArticleLine: " + _currentArticle + " on page '" + getCurrentPageName() + "'");
	var newsArticle = getCurrentNewsArticle();
	if (newsArticle) {
		if (newsArticleIsValid(pdf, newsArticle)) {
			_validArticles++;
			fillNewsPageWithLineContent(pdf);
		} else {
			continueAfterInvalidArticle(pdf);
		}
	} else {
		console.log("No news Article " + _currentArticle + " on page '" + getCurrentPageName() + "'");
		setTimeout(function () {readPageDone(pdf);}, 1000);
	}
}

const readPageDone = function(pdf) {
	console.log("readPageDone: '" + getCurrentPageName() + "'");
	if (isLastPage() || (Number(_currentPageName) > _maxPage)) {
		console.log("isLastPage(): '" + getCurrentPageName() + "'");
		savePdf(pdf);
		moveToFirstPageAfterExport();
	} else {
		console.log("isNot LastPage(): '" + getCurrentPageName() + "'");
		setTimeout(function () {readPage(pdf);}, 1000);
		console.log("next Page Please: '" + getCurrentPageName() + "'");
		clickNextPage();
	}
}

const moveToFirstPageAfterExport = function() {
	if (isFirstPage()) {
		_busyExporting = false;
		addNewsExportButton();
	} else {
		setTimeout(function () {moveToFirstPageAfterExport();}, 1000);
		clickFirstPage();
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
		if (articleDate >= _exportStartDate && articleDate <= _exportEndDate) {
			console.log("Article is valid");
			return true;
		} else {
			console.log("Article is not valid: Invalid dates: articleDate: " + articleDate + ", dateRange: (" + _exportStartDate + ", " + _exportEndDate + ")");
		}
	} else {
		console.log("Article is not valid: No News Article");
	}
	return false;
}

const writeDocumentTitle = function(pdf) {
	var titleLineHeight = setFont(pdf, _fontSizeTitle, _fontTypeTitle);
	documentTitle = 'Scipio ' + _newsTitle + " van " + _exportStartDate.toLocaleDateString() + " t/m " + _exportEndDate.toLocaleDateString();
	_pageY += titleLineHeight;
	console.log("writeDocumentTitle: " + documentTitle);
	pdf.text(_viewLeft, _pageY, documentTitle);
}

const fillNewsPageWithLineContent = function(pdf) {
	console.log("fillNewsPageWithLineContent: " + _currentArticle + ", _pageY = " + _pageY);

	var articleTitleLineHeight = setFont(pdf, _fontSizeArticleTitle, _fontTypeArticleTitle);
	var publicationDateLineHeight = setFont(pdf, _fontSizePublicationDate, _fontTypePublicationDate);
	var articleLineHeight = setFont(pdf, _fontSizeArticleContent, _fontTypeArticleContent);
	var heightNeeded = articleTitleLineHeight + publicationDateLineHeight * 2 + articleLineHeight;
	if (!newPageIfNeeded(pdf, heightNeeded)) {
		_pageY += articleTitleLineHeight / 2;
		drawBlackLine(pdf);
		_pageY += articleTitleLineHeight / 2;
	}

	// Print article title
	var articleTitleLineHeight = setFont(pdf, _fontSizeArticleTitle, _fontTypeArticleTitle);
	var newsArticle = getCurrentNewsArticle();
	var articleTitle = newsArticle.getElementsByTagName("td").item(1).innerText;
	if (articleTitle) {
		articleTitle = articleTitle.trim();
	} else {
		articleTitle = "Naamloos artikel";
	}
	_pageY += articleTitleLineHeight;
	pdf.text(_viewLeft, _pageY, articleTitle);
	drawRedLine(pdf);
	console.log("fillNewsPageWithLineContent: " + _currentArticle + ", articleTitle = " + articleTitle + ", _pageY = " + _pageY);

	// Print publication Date
	var publicationDateLineHeight = setFont(pdf, _fontSizePublicationDate, _fontTypePublicationDate);
	publicatie = newsArticle.getElementsByTagName("td").item(2).innerText;
	_pageY += publicationDateLineHeight;
	pdf.text(_viewLeft, _pageY, "Publicatiedatum: " + publicatie.replaceAll("\n"," "));
	drawGreenLine(pdf);
	console.log("fillNewsPageWithLineContent: " + _currentArticle + ", publicatie = " + publicatie + ", _pageY = " + _pageY);
	_pageY += publicationDateLineHeight;
	drawRedLine(pdf);

	// Open the new article contents
	console.log("fillNewsPageWithLineContent: " + _currentArticle + ", newsArticle.click(), _pageY = " + _pageY);
	newsArticle.click();

	setTimeout(function () {fillNewsPageWithNewsContent(pdf);}, 2000);
}

const fillNewsPageWithNewsContent = function(pdf) {
	console.log("fillNewsPageWithNewsContent: " + _currentArticle + ", _pageY = " + _pageY);

	// Print article intro
	inleiding = document.getElementsByTagName("textarea").item(0).value;
	if (inleiding) {
		console.log("fillNewsPageWithNewsContent: " + _currentArticle + ", inleiding = " + inleiding + ", _pageY = " + _pageY);

		printMultilineText(pdf, _fontSizeArticleIntro, _fontTypeArticleIntro, inleiding, false);
	}

	// Print article content
	bericht = document.getElementsByTagName("textarea").item(1).value;
	if (bericht) {
		console.log("fillNewsPageWithNewsContent: " + _currentArticle + ", bericht, _pageY = " + _pageY);

		bericht = bericht.replaceAll(/\u200b/g, "") /* Replace special Word characters*/
						.replaceAll(/<li>/gi, "• ") /* Maak Bullet points */
						.replaceAll(/<\/li>/gi, "") /* Verwijder einde van bullet point */
						.replaceAll(/<ul>/gi, "") /* verwijder begin van list */
						.replaceAll(/<\/ul>/gi, "\n") /* verwijder eind van list */
						.replaceAll(/^[ ]+/gi, "") /* remove spaces on the start line */
						.replaceAll(/[ ]+$/gi, "") /* remove spaces on the end line */
						.replaceAll(/<br>/gi, "\n") /* replace breakpoints met new line */
						.replaceAll(/\n{3,}/gi, "\n\n") /* replace 3 or more multiple line endings */
						.replaceAll(/<\/?i>/gi, "") /* remove italic tags */
						.replaceAll(/<\/?u>/gi, "") /* remove underline tags */
						.replaceAll(/[ ]{2,}/g, " "); /* replace multiple spaces with 1 space */
						//.replaceAll(/\n*Klik.+givt\n*/gi, "");

		printMultilineText(pdf, _fontSizeArticleContent, _fontTypeArticleContent, bericht, inleiding);
	}

	// Print Audio link
	var audios = document.querySelectorAll('[ng-model="newsItem.audioUrl"]');
	if (audios.length > 0) {
		var audioUrl = audios.item(0).value;
		if (audioUrl) {
			console.log("Audio Url: " + audioUrl);
			printArticleUrl(pdf, _fontSizeArticleContent, _fontTypeArticleContent, "Audio:", audioUrl);
		}
	}

	// Print video link
	var videos = document.querySelectorAll('[ng-model="newsItem.videoUrl"]');
	if (videos.length > 0) {
		var videoUrl = videos.item(0).value;
		if (videoUrl) {
			console.log("Video Url: " + videoUrl);
			printArticleUrl(pdf, _fontSizeArticleContent, _fontTypeArticleContent, "Video:", videoUrl);
		}
	}

	// Print website link
	var websites = document.querySelectorAll('[ng-model="newsItem.articleUrl"]');
	if (websites.length > 0) {
		var websiteUrl = websites.item(0).value;
		if (websiteUrl) {
			console.log("Website Url: " + websiteUrl);
			printArticleUrl(pdf, _fontSizeArticleContent, _fontTypeArticleContent, "Website:", websiteUrl);
		}
	}

	// Back to the list
	console.log("fillNewsPageWithNewsContent: " + _currentArticle + ", cancel.click(), _pageY = " + _pageY);
	clickCancel();

	setTimeout(function () {afterFillNewsPageWithNewsContent(pdf);}, 1000);
}

const clickCancel = function() {
	console.log("Click Cancel");
	document.getElementsByClassName("cancel").item(0).click();
}

const printMultilineText = function(pdf, fontSize, fontType, text, extraLine) {
//	console.log("rawText: " + text);
	lineHeight = setFont(pdf, fontSize, fontType);
	if (extraLine) {
		_pageY += lineHeight;
	}
	var textWithoutMarkings = removeAnchors(text);
	textWithoutMarkings = removeBold(textWithoutMarkings);

//	console.log("textWithoutMarkings: " + textWithoutMarkings);

	lines = pdf.splitTextToSize(textWithoutMarkings, _viewWidth);
	var lineText = '';
	var orgText = '';
	var orgLineRegEx = null;
	for (let line in lines) {
		if (newPageIfNeeded(pdf, lineHeight)) {
			setFont(pdf, fontSize, fontType);
		}
		_pageY += lineHeight;

		lineText = lines[line];
		orgText = lineText;
		if (lineText.trim().length > 0) {
//			console.log("rawline: " + lineText);

			var regexText = escapeRegExp(lineText);

//			console.log("regexText: " + regexText);

			orgLineRegEx = new RegExp("^(.*" + regexText + ".*)$","gm");
			//console.log(orgLineRegEx);
			var orgMatch = orgLineRegEx.exec(text);
//			if (orgMatch) {
//				console.log(orgMatch);
//			}
			if (orgMatch && (orgMatch.length > 1)) {
				orgText = orgMatch[1];
				console.log("orgline: " + orgText);
			}
		}
		if (/^<b>.+<\/b>/gi.test(orgText)) {
			console.log("Bold line: " + orgText);
			setFont(pdf, fontSize, "bold");
			lineText = lineText.replaceAll(/<\/?b>/gi, "");
		} else {
			setFont(pdf, fontSize, fontType);
		}
		if (/^<a href=[\'\"]https?.+<\/a>/gi.test(orgText)) {
			var match = /href='(https?[^']+)'/.exec(orgText);
			var url = match[1];
			lineText = removeAnchors(orgText);
			lineText = removeBold(lineText);
			console.log("URL(" + url + ") line: " + lineText);
			var options = {};
			options.url = url;
			pdf.setTextColor(0, 0, 255);
			pdf.textWithLink(lineText, _viewLeft, _pageY, options);
			pdf.setTextColor(0, 0, 0);
		} else {
			lineText = removeAnchors(lineText);
			lineText = removeBold(lineText);
			pdf.text(_viewLeft, _pageY, lineText);
		}
	}
}

const escapeRegExp = function(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
const removeAnchors = function(text) {
	return text.replaceAll(/<a href=[\'\"][^\s]+[\'\"]>/g, "").replaceAll(/<\/a>/g, "");
}
const removeBold = function(text) {
	return text.replaceAll(/<\/?b>/gi, "");
}

const printArticleUrl = function(pdf, fontSize, fontType, label, url) {
	lineHeight = setFont(pdf, fontSize, fontType);

	if (newPageIfNeeded(pdf, lineHeight)) {
		setFont(pdf, fontSize, fontType);
	}
	_pageY += lineHeight;

	pdf.text(_viewLeft, _pageY, label);
	var options = {};
	options.url = url;
	pdf.setTextColor(0, 0, 255);
	pdf.textWithLink(url, _viewLeft + 50, _pageY, options);
	pdf.setTextColor(0, 0, 0);
}

const newPageIfNeeded = function(pdf, heightNeeded) {
	if (_footerY < _pageY + heightNeeded) {
		newPage(pdf);
		return true;
	} else {
		return false;
	}
}

const afterFillNewsPageWithNewsContent = function(pdf) {
	console.log("afterFillNewsPageWithNewsContent: " + _currentArticle + " on page '" + getCurrentPageName() + "', _pageY = " + _pageY);
	if (_currentPageName != getCurrentPageName()) {
		console.log("currentPage: " + getCurrentPageName() + " is not the expected page " + _currentPageName);
		if (Number(getCurrentPageName()) < Number(_currentPageName)) {
			clickNextPage();
		} else {
			clickPrevPage();
		}
		setTimeout(function () {afterFillNewsPageWithNewsContent(pdf);}, 1000);
	} else {
		console.log("currentPage: " + getCurrentPageName() + " is the expected page " + _currentPageName);
		_currentArticle++;
		setTimeout(function () {readCurrentArticleLine(pdf);}, 1000);
	}
}

const continueAfterInvalidArticle = function(pdf) {
	console.log("continueAfterInvalidArticle " + _currentArticle + " on page '" + getCurrentPageName() + "'");
	_currentArticle++;
	setTimeout(function () {readCurrentArticleLine(pdf);}, 250);
}

const createSelectOption = function(value, text, selected) {
	option = document.createElement("option");
	option.value = value;
	option.text = text;
	if (selected) {
		option.setAttribute("selected", "selected");
	}
	return option;
}

const setDates = function() {
	daySelect = document.getElementById("daySelect");

	today = new Date();
	thisDay = today.getDay();

	selectedDay = daySelect.selectedIndex;

	subtractDays = thisDay - selectedDay;
	if (subtractDays < 1) {
		subtractDays += 7;
	}

	now = Date.now();
	endDateMs = now - (subtractDays * 24 * 60 * 60 * 1000);
	startDateMs = now - ((subtractDays + 13) * 24 * 60 * 60 * 1000);

	endDate = new Date(endDateMs);
	startDate = new Date(startDateMs);

	document.getElementById("exportDateFromInput").value = startDate.toISOString().slice(0,10);
	document.getElementById("exportDateToInput").value = endDate.toISOString().slice(0,10);

	setExportDescription();
}

const changeDaySelectHandler = function() {
	daySelect = document.getElementById("daySelect");
	localStorage.setItem("ScipioPlusExportSelectedDay", daySelect.selectedIndex);
	setDates();
}

const setExportDescription = function() {
	exportDescription = document.getElementById("exportDescription");
	vanaf = (new Date(document.getElementById("exportDateFromInput").value)).toUTCString().replaceAll("00:00:00 GMT", "");
	tm = (new Date(document.getElementById("exportDateToInput").value)).toUTCString().replaceAll("00:00:00 GMT", "");
	exportDescription.innerText = "Export vanaf '" + vanaf + "' t/m '" + tm + "'";
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
		exportDateFromInput.addEventListener("change", setExportDescription);

		exportDateToLabel = document.createElement("label");
		exportDateToLabel.setAttribute("for", "exportDateToInput");
		exportDateToLabel.innerText = "Datum tot en met:";

		exportDateToInput = document.createElement("input");
		exportDateToInput.setAttribute("id", "exportDateToInput");
		exportDateToInput.setAttribute("type", "date");
		exportDateToInput.addEventListener("change", setExportDescription);

		newsExportButton = document.createElement("button");
		newsExportButton.setAttribute("id", "newsExportButton");
		newsExportButton.setAttribute("class","button primary");
		newsExportButton.innerText = "Exporteer " + _newsTitle + " als pdf";
		newsExportButton.addEventListener("click", newsExportButtonClickHandler);

		var selectedDaySaved = localStorage.getItem("ScipioPlusExportSelectedDay");
		console.log("selectedDaySaved: " + selectedDaySaved);

		if (selectedDaySaved) {
			selectedDay = parseInt(selectedDaySaved);
		} else {
			selectedDay = 4;
		}

		daySelect = document.createElement("select");
		daySelect.setAttribute("id", "daySelect");
		daySelect.appendChild(createSelectOption(0, "Zondag", selectedDay == 0));
		daySelect.appendChild(createSelectOption(1, "Maandag", selectedDay == 1));
		daySelect.appendChild(createSelectOption(2, "Dinsdag", selectedDay == 2));
		daySelect.appendChild(createSelectOption(3, "Woensdag", selectedDay == 3));
		daySelect.appendChild(createSelectOption(4, "Donderdag", selectedDay == 4));
		daySelect.appendChild(createSelectOption(5, "Vrijdag", selectedDay == 5));
		daySelect.appendChild(createSelectOption(6, "Zaterdag", selectedDay == 6));
		daySelect.addEventListener("change", changeDaySelectHandler);

		exportDescription = document.createElement("div");
		exportDescription.setAttribute("id", "exportDescription");

		exportBtnGroup.appendChild(exportDateFromLabel);
		exportBtnGroup.appendChild(exportDateFromInput);
		exportBtnGroup.appendChild(exportDateToLabel);
		exportBtnGroup.appendChild(daySelect);
		exportBtnGroup.appendChild(exportDateToInput);
		exportBtnGroup.appendChild(newsExportButton);
		exportBtnGroup.appendChild(exportDescription);

		setDates();
	}
}