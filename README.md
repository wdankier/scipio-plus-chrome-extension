# Scipio Plus Chrome Extension
An extension for the Chrome browser to extend the capabilities once logged in as registered Scipio administrator
## New in version 0.3.1
- Added a day-of-the-week selector, to auto select the date field. When selecting a day (like monday), the end-date will be the previous monday. So when the current day is monday, it will will the end-date-fied with the previous monday (a week ago).
- The selection will be stored in the localStorage of the browser. The date fields are not stored.
- While exporting, the export control of this extension will not be draw until the export is finished.
## New in version 0.3
- Added a title to the pdf coument reflecting the newpages name and the chosen dates.
## New in version 0.2
- Exporting news items has now a date filter. For now it is prepopulated to export articles from last monday, two weeks ago, until the previous sunday.
## How to test this extension
- In the browser-window menu (with the three dots), open Helper programs menu and select Extensions.
- Next you should enable the developer mode in the top right corner of the window.
- Finaly you can load an upacked extension by clicking that button and selecting your local checkout directory.
