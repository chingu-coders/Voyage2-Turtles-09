(function() {
  "use strict";

  const settingsIcon = document.querySelector(".settings-icon");
  const settingsPanel = document.querySelector(".settings");
  const settingsNav = document.querySelector(".settings-nav");
  const aboutText = document.querySelector(".settings-about-text");
  const settingsGeneral = document.querySelector(".settings-general");
  const manifest = chrome.runtime.getManifest();

  // Toggle settings panel on and off when settings icon (cog) is clicked.
  settingsIcon.addEventListener("click", toggleSettingsPanel);

  function toggleSettingsPanel() {
    settingsIcon.classList.toggle("clicked");
    settingsPanel.classList.toggle("hidden");
  }

  // Display appropriate settings panel when a nav item is clicked.  
  settingsNav.addEventListener("click", function() {
    let target = event.target;
    addClassToOneChild(".settings-nav", target);
    let chosenSubpanel = document.querySelector(`#settings${target.innerHTML}`);
    hideAllChildrenButOne("settingsSubpanelContainer", chosenSubpanel);
  });

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

})();