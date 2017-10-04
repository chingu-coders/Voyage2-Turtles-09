"use strict";

/* Main Focus */
(function() {
  const focusInput = document.querySelector("#focus-input");
  const focusOutput = document.querySelector("#focus-output");
  const focusOutWrapper = document.querySelector("#focus-output-wrapper");
  const focusInWrapper = document.querySelector("#focus-input-wrapper");
  let focusText = chrome.storage.sync.get("focus", function() {
    if (focusText === ) {
      let focusText = "";
    }
  });

  

  focusInput.addEventListener("keydown", function(event) {
    if (event.keyCode === 13){ //Enter key pressed
      if (this.value !== "") {
        focusText = this.value;
        this.value = "";
        chrome.storage.sync.set({"focus": focusText}, function() {
          console.log("focus saved");
        });
        focusOutput.innerHTML = focusText;
        focusOutWrapper.classList.remove("hidden");
        focusInWrapper.classList.add("hidden");
      }
    }
  });


})();
