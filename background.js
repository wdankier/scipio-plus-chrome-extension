async function sendTabUrl() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tab = tabs[0];
//    console.log("Updated " + new Date());
    //console.log(tab);
    if (tab.url && tab.url.includes("https://www.socie.nl/beheer")) {
      if (tab.url.includes("members_settings/members")) {
        let msg = {message: 'members_page', url: tab.url};
        chrome.tabs.sendMessage(tab.id, msg, function(response) {});
      } else if (tab.url.includes("#/news")) {
        let msg = {message: 'news_page', url: tab.url};
        chrome.tabs.sendMessage(tab.id, msg, function(response) {});
      }
    } 
  });
}

chrome.tabs.onUpdated.addListener(sendTabUrl);
