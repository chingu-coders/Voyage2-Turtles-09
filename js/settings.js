(function() {
  "use strict";

  const STORAGE = chrome.storage.sync;
  const settingsIcon = document.querySelector(".settings-icon");
  const settingsPanel = document.querySelector(".settings");
  const settingsNav = document.querySelector(".settings-nav");
  //const generalFeatureList = document.querySelector("#settingsGeneral ul");
  //const generalFeatureArray = document.querySelectorAll(".toggle-feature");
  const aboutText = document.querySelector(".settings-about-text");
  const settingsGeneral = document.querySelector(".settings-general");
  const manifest = chrome.runtime.getManifest();
  let featurePreferences = {};

  // Check if feature preferences have been set.
  getFeaturePreferences();

  // Toggle settings panel on and off when settings icon (cog) is clicked.
  settingsIcon.addEventListener("click", toggleSettingsPanel);

  // Display appropriate settings panel when a nav item is clicked.  
  settingsNav.addEventListener("click", function() {
    // Indicate which nav item is currently selected.
    let target = event.target;
    addClassToOneChild(".settings-nav", target, "settings-current");
    // If chosen panel is "About", pull data from manifest
    if (target.innerHTML === "About") {
      populateAboutTab();
    }
    // Display the correct panel.
    let chosenSubpanel = document.querySelector(`#settings${target.innerHTML}`);
    hideAllChildrenButOne("settingsSubpanelContainer", chosenSubpanel);
  });

  // Watch general feature list for changes.
  /*console.log(generalFeatureList);
  generalFeatureList.addEventListener("click", function() {
    let target = event.target;
    console.log("boo: " + target.control);
  });*/

  function toggleSettingsPanel() {
    settingsIcon.classList.toggle("clicked");
    settingsPanel.classList.toggle("hidden");
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

  function getFeaturePreferences() {
    // Is there already a featurePreferences array in storage?
    STORAGE.get("featurePreferences", function(obj){
      //console.log(`foobar: ${JSON.stringify(obj.featurePreferences)}`);
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("getFeaturePreferences(): " + error);
      }
      else {
        // if there is, display it
        if (obj.featurePreferences) {
          // Store it in a variable so that we can work with it.
          featurePreferences = obj.featurePreferences;
          console.log(featurePreferences);
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
          console.log(featurePreferences);
        }
      }
    });
  }

  function displayPreferencesInSettings() {
    let key;
    let keys = Object.keys(featurePreferences);
    console.log(keys);
    for (key in keys) {
    console.log(keys[key]);
  }
    for (let i = 0; i < featurePreferences.length; i++) {
      console.log(featurePreferences[i]);
    }
  }

})();