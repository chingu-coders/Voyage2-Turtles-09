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
  let userPreferences = {};

  // Check if feature preferences have been set.
  getUserPreferences();

  // Toggle settings panel on and off when settings icon (cog) is clicked.
  settingsIcon.addEventListener("click", toggleSettingsPanel);

  // Change Settings panel when nav is clicked
  addListenerToSettingsNavigation()

  // listen for changes to visibility of Widgets in General Settings
  addListenersToGeneralSettings();

  function addListenersToGeneralSettings() {
    // Add a listener to each toggle switch in General Settings
    let keys = Object.keys(toggleFeatures);
    keys.forEach(function(key) {
      toggleFeatures[key].children[0].addEventListener("click", showHideWidgets);
    });
  }

  function showHideWidgets() {
    // If checkbox is checked (toggle switch is on).
    // Uncheck checkbox (set toggle switch to off).
    // And update userPreferences object.
    if (this.hasAttribute("checked")) {
      this.removeAttribute("checked");
      userPreferences[this.id] = false;
      hideWidget(this.id);
    }
    // If checkbox is unchecked (toggle switch is off)
    // Check checkbox (set toggle switch to on)
    // And update userPreferences object.
    else {
      this.setAttribute("checked", "checked");
      userPreferences[this.id] = true;
      showWidget(this.id);
    }
    // Save userPreferences to chrome.storage.sync
    STORAGE.set({"userPreferences": userPreferences}, function() {
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("save userPreferences: " + error);
      }
    });
  }

  function toggleSettingsPanel() {
    settingsIcon.classList.toggle("clicked");
    settingsPanel.classList.toggle("hidden");
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

  function getUserPreferences() {
    // Is there already a userPreferences array in storage?
    STORAGE.get("userPreferences", function(obj){
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("getUserPreferences(): " + error);
      }
      else {
        // if preferences exist in storage
        if (obj.userPreferences) {
          // Store them in a variable so that we can work with them.
          userPreferences = obj.userPreferences;
          // if there is, use it to set toggle switches in General Settings
          // and show/hide widgets as appropriate
          displayPreferences();
        }
        /* if not, set defaults */
        /*else {
          userPreferences =  {
           "displayRecipe": true,
           "displayTime": true,
           "displayGreeting": true,
           "displayFocus": true,
           "displayTodo": true,
           "displayQuote": true
          };
        }*/
      }
    });
  }

  function displayPreferences() {
    let keys = Object.keys(userPreferences);
    keys.forEach(function(key) {
      if (userPreferences[key] === false) {
        document.getElementById(key).removeAttribute("checked");
        hideWidget(key);
      }
      else {
        document.getElementById(key).setAttribute("checked", "checked");
        showWidget(key);
      }
    });
  }

  function showWidget(element) {
    let trigger = document.getElementById(element); // targets the input
    let target = document.getElementsByClassName(trigger.dataset[element.toLowerCase()]); // targets the widget container
    showElement(target[0]);
  }

  function hideWidget(element) {
    let trigger = document.getElementById(element); // targets the input
    let target = document.getElementsByClassName(trigger.dataset[element.toLowerCase()]); // targets the widget container
    hideElement(target[0]);
  }



})();