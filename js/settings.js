(function() {
  "use strict";

  const settingsIcon = document.querySelector(".settings-icon");
  const settingsPanel = document.querySelector(".settings");
  const extensionName = document.querySelector(".settingsAbout h1");
  const manifest = chrome.runtime.getManifest();
console.log(manifest.version);

  settingsIcon.addEventListener("click", toggleSettingsPanel);

  function toggleSettingsPanel() {
    settingsPanel.classList.toggle("hidden");
  }

  
  extensionName.innerHTML = manifest.name;

/********************
 * Utility Functions
 ********************/
  function showElement(element) {
    element.classList.remove("hidden");
  }

  function hideElement(element) {
    element.classList.add("hidden");
  }

})();