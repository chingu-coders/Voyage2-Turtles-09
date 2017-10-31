(function() {
  "use strict";

  const STORAGE = chrome.storage.sync;
  const settingsIcon = document.querySelector(".settings-icon");
  const settingsPanel = document.querySelector(".settings");
  const settingsNav = document.querySelector(".settings-nav");
  const displayRecipe = document.querySelector("#displayRecipe");
  const displayTime = document.querySelector("#displayTime");
  const displayGreeting = document.querySelector("#displayGreeting");
  const displayFocus = document.querySelector("#displayFocus");
  const displayTodo = document.querySelector("#displayTodo");
  const displayQuote = document.querySelector("#displayQuote");
  const aboutText = document.querySelector(".settings-about-text");
  const settingsGeneral = document.querySelector(".settings-general");
  const toggleFeatures = document.querySelectorAll(".toggle-feature");
  const manifest = chrome.runtime.getManifest();
  let featurePreferences = {};

  // Toggle settings panel on and off when settings icon (cog) is clicked.
  settingsIcon.addEventListener("click", toggleSettingsPanel);

  addListenerToSettingsNavigation()

  let keys = Object.keys(toggleFeatures);
  keys.forEach(function(key) {
    toggleFeatures[key].children[0].addEventListener("click", function() {
      console.log(this.id);
      console.log(featurePreferences);
      if (this.hasAttribute("checked")) {
        //console.log("true");
        this.removeAttribute("checked");
      }
      else {
        //console.log("false");
        this.setAttribute("checked", "checked");
      }
    });
  });

  function toggleSettingsPanel() {
    settingsIcon.classList.toggle("clicked");
    settingsPanel.classList.toggle("hidden");
    if (! settingsPanel.classList.contains("hidden")) {
      // Check if feature preferences have been set.
      getFeaturePreferences();
    }
  }

  function addListenerToSettingsNavigation() {    
    // Display appropriate settings panel when a nav item is clicked.  
    settingsNav.addEventListener("click", function() {

      // Indicate which nav item is currently selected.
      let target = event.target;
      addClassToOneChild(".settings-nav", target, "settings-current");

      // If chosen panel is "About", pull data from manifest.
      if (target.innerHTML === "About") {
        populateAboutTab();
      }

      // If chosen panel is "Links", add event listeners.
      if (target.innerHTML === "Links") {
        initLinks();
      }

      // Display the correct panel.
      let chosenSubpanel = document.querySelector(`#settings${target.innerHTML}`);
      hideAllChildrenButOne("settingsSubpanelContainer", chosenSubpanel);
    });
  }

  function populateAboutTab() {
    aboutText.innerHTML = `
    <h1>${manifest.name}</h1>
    <p class="settings-version">Personal Dashboard <span>v${manifest.version}</span></p>
    <p>Thank you for your support!</p>
    <ul>
      <li><a href="https://github.com/chingu-coders/Voyage2-Turtles-09">GitHub</a></li>
      <li><a href="https://medium.com/chingu">Chingu</a></li>
      <li><a href="">Website</a></li>
      <li><a href="">Twitter</a></li>
    </ul>
    <footer>Made with <span class="fa fa-heart"></span> by Chingu developers</footer>
  `;
  }

  function initLinks() {
    const linkToChromeTab = document.querySelector(".link-chrome-tab");
    const linkToApps = document.querySelector(".link-apps");

    linkToChromeTab.addEventListener("click", function() {
      chrome.tabs.create({url: "chrome-search://local-ntp/local-ntp.html"});
    });

    linkToApps.addEventListener("click", function() {
      chrome.tabs.create({url: "chrome://apps"});
    });
  }

  function getFeaturePreferences() {
    // Is there already a featurePreferences array in storage?
    STORAGE.get("featurePreferences", function(obj){
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("getFeaturePreferences(): " + error);
      }
      else {
        // if there is, display it
        if (obj.featurePreferences) {
          // Store it in a variable so that we can work with it.
          featurePreferences = obj.featurePreferences;
          displayPreferencesInSettings();
        }
        /* if not, set defaults */
        else {
          featurePreferences =  {
           "displayRecipe": true, 
           "displayTime": true, 
           "displayGreeting": true, 
           "displayFocus": true, 
           "displayTodo": true, 
           "displayQuote": true
          };
        }
      }
    });
  }

  function displayPreferencesInSettings() {
    let keys = Object.keys(featurePreferences);
    keys.forEach(function(key) {
      if (featurePreferences[key] === false) {
        document.getElementById(key).checked = false;
      }
      else {
        document.getElementById(key).checked = true;
      }
    });
  }

})();