"use strict";

/* Main Focus */

(function() {
  const focusInput = document.querySelector("#focus-input");
  const focusOutput = document.querySelector("#focus-output");
  const focusOutWrapper = document.querySelector("#focus-output-wrapper");
  const focusInWrapper = document.querySelector("#focus-input-wrapper");
  const focusClose = document.querySelector(".focus-close");
  const focusCheckbox = document.querySelector(".focus-checkbox");
  const focusUncheckedBox = document.querySelector(".fa-square-o");
  const focusCheckedBox = document.querySelector(".fa-check-square-o");

  let focusObj = {
    "focusText": "",
    "focusCompleted": false,
    "focusTimestamp": 0
  };

  getFocus();

  focusOutWrapper.addEventListener("mouseover", function(event) {
    showElement(focusClose);
    showElement(focusCheckbox);
  });

  focusOutWrapper.addEventListener("mouseleave", function(event) {
    hideElement(focusClose);
    hideElement(focusCheckbox);
  });

  focusClose.addEventListener("click", function() {
    deleteFocus();
  });

  focusCheckedBox.addEventListener("click", function() {
    toggleOffFocusCompleted();
  });

  focusUncheckedBox.addEventListener("click", function() {
    toggleOnFocusCompleted();
  });

  function getFocus() {
    /* Is there already a focus in storage? */
    chrome.storage.sync.get("focusObj", function(obj){
      /* if there is, display it */      
      if (obj.focusObj !== undefined && obj !== {}) { //TODO test if this condition is sufficient
        console.log(obj.focusObj.focusText);
        focusObj = obj.focusObj;
        /* check if focus has been completed */
        if (focusObj.focusCompleted === true) {
          markAsComplete();
          focusOutput.classList.add("focus-completed");
          console.log("focus completed");
        }
        /* TODO figure out if the else statement is needed */
        else {
          focusOutput.classList.remove("focus-completed");
        }
        showElement(focusOutWrapper);
        displayFocus(focusObj.focusText);
      }
      /* if not, get focus from user */
      else {
        showElement(focusInWrapper);
        markAsIncomplete();
        getFocusFromUser();
      }
    });
  }

  function getFocusFromUser() {
    focusInput.addEventListener("keydown", function(event) {
      if (event.keyCode === 13){ //Enter key pressed
        if (this.value !== "") {
          focusObj.focusText = this.value;
          focusObj.focusTimestamp = Date.now();
          this.value = "";
          displayFocus(focusObj.focusText) 
          chrome.storage.sync.set({focusObj}, function() {
            /* TODO remove get and console.log, and figure out how to handle errors */
            chrome.storage.sync.get(null, function(data){
              console.log(data);
            });
          });       
        }
      }
    });
  }

  function displayFocus(focusText) {
    hideElement(focusInWrapper);
    focusOutput.innerHTML = focusObj.focusText;
    showElement(focusOutWrapper);
  }

  function deleteFocus() {
    chrome.storage.sync.remove("focusObj");
    hideElement(focusOutWrapper);
    focusOutput.innerHTML = "";
    markAsIncomplete();
    getFocus();
  }

  function toggleOnFocusCompleted() {
    markAsComplete()
    focusObj.focusCompleted = true;
    chrome.storage.sync.set({focusObj});
  }

  function toggleOffFocusCompleted() {
    markAsIncomplete();
    focusObj.focusCompleted = false;
    chrome.storage.sync.set({focusObj});
  }

  function markAsIncomplete() {
    focusOutput.classList.remove("focus-completed");
    showElement(focusUncheckedBox);
    hideElement(focusCheckedBox);
  }

  function markAsComplete() {
    focusOutput.classList.add("focus-completed");
    showElement(focusCheckedBox);
    hideElement(focusUncheckedBox);
  }

  function showElement(element) {
    element.classList.remove("hidden");
  }

  function hideElement(element) {
    element.classList.add("hidden");
  }

})();

/* end of Main Focus */