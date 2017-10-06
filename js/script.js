"use strict";

/* Main Focus */
(function() {
  const focusInput = document.querySelector("#focus-input");
  const focusOutput = document.querySelector("#focus-output");
  const focusOutWrapper = document.querySelector("#focus-output-wrapper");
  const focusInWrapper = document.querySelector("#focus-input-wrapper");
  const focusClose = document.querySelector(".focus-close");
  let focusText;

  getFocus();

  focusOutWrapper.addEventListener("mouseover", function(event) {
    showElement(focusClose);
  });

  focusOutWrapper.addEventListener("mouseleave", function(event) {
    hideElement(focusClose);
  });

  focusClose.addEventListener("click", function(event) {
    deleteFocus();
  });

  function getFocus() {
    /* Is there already a focus in storage? */
    chrome.storage.sync.get("focus", function(data){
      /* if there is, display it */    
      if (data.focus !== undefined) {
        showElement(focusOutWrapper);
        displayFocus(data.focus);
      }
      /* if not, get focus from user */
      else {
        //console.log(data);
        showElement(focusInWrapper);
        getFocusFromUser();
      }
    });
  }

  function getFocusFromUser() {
    focusInput.addEventListener("keydown", function(event) {
      if (event.keyCode === 13){ //Enter key pressed
        if (this.value !== "") {
          focusText = this.value;
          this.value = "";
          displayFocus(focusText) 
          chrome.storage.sync.set({"focus": focusText}, function() {
            /* TODO remove get and console.log, and figure out how to handle errors */
            chrome.storage.sync.get(["focus"], function(data){
              console.log(data);
            });
          });       
        }
      }
    });
  }

  function displayFocus(focusText) {
    hideElement(focusInWrapper);
    focusOutput.innerHTML = focusText;
    showElement(focusOutWrapper);
  }

  function showElement(element) {
    element.classList.remove("hidden");
  }

  function hideElement(element) {
    element.classList.add("hidden");
  }

  function deleteFocus() {
    chrome.storage.sync.remove(["focus"]);
    hideElement(focusOutWrapper);
    focusOutput.innerHTML = "";
    getFocus();
  }

})();
