async function sendTabUrl() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tab = tabs[0];
    if (tab && tab.url && tab.url.includes("https://beheer.socie.nl/")) {
      if (tab.url.includes("members_settings/members")) {
        let msg = {message: 'members_page', url: tab.url};
        chrome.tabs.sendMessage(tab.id, msg, function(response) {console.log(response)});
      } else if (tab.url.includes("#/news")) {
        let msg = {message: 'news_page', url: tab.url};
        chrome.tabs.sendMessage(tab.id, msg, function(response) {console.log(response)});
      }
    } 
  });
}

chrome.tabs.onUpdated.addListener(sendTabUrl);
