"use strict";

/* Main Focus */
(function() {
  const focusInput = document.querySelector("#focus-input");
  const focusOutput = document.querySelector("#focus-output");
  const focusOutWrapper = document.querySelector("#focus-output-wrapper");
  const focusInWrapper = document.querySelector("#focus-input-wrapper");
  let focusText;

  /*chrome.storage.sync.get("focus", function(obj) { */
    /* TODO need to check if chrome.storage returns null when it doesn't find the key */
  /*  if (obj.focus === null) {
      focusText = "";
    }
    else {
      focusText = obj.focus;
    }
  console.log(focusText);
  });*/


  focusInput.addEventListener("keydown", function(event) {
    if (event.keyCode === 13){ //Enter key pressed
      if (this.value !== "") {
        focusText = this.value;
        this.value = "";
        chrome.storage.sync.set({"focus": focusText}, function() {
          chrome.storage.sync.get("focus", function(data){
            console.log("focus saved: " + data.focus);
          });
        });
        displayFocus(focusText)        
      }
    }
  });

  function displayFocus(focusText) {
    focusInWrapper.classList.add("hidden");
    focusOutput.innerHTML = focusText;
    focusOutWrapper.classList.remove("hidden");
  }

})();
