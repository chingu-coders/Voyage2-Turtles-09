(function() {
  "use strict";

  chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({url: "index.html"});
  });

})();
