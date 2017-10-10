"use strict";

/* Main Focus */

(function() {
  const focusInput = document.querySelector("#focus-input");
  const focusOutput = document.querySelector("#focus-output");
  const focusOutWrapper = document.querySelector("#focus-output-wrapper");
  const focusInWrapper = document.querySelector("#focus-input-wrapper");
  const focusDelete = document.querySelector(".focus-delete");
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
    showElement(focusDelete);
    showElement(focusCheckbox);
  });

  focusOutWrapper.addEventListener("mouseleave", function(event) {
    hideElement(focusDelete);
    hideElement(focusCheckbox);
  });

  focusDelete.addEventListener("click", function() {
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
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("getFocus(): " + error);
      }
      else {
        /* if there is, display it */      
        if (obj.focusObj) {
          //console.log(obj.focusObj.focusText);
          focusObj = obj.focusObj;
          /* check if focus has been completed */
          if (focusObj.focusCompleted === true) {
            markAsComplete();
          }
          displayFocus(focusObj.focusText);
        }
        /* if not, get focus from user */
        else {
          showElement(focusInWrapper);
          markAsIncomplete();
          getFocusFromUser();
        }
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
            let error = chrome.runtime.lastError;
            if (error) {
              console.error("getFocusFromUser(): " + error);
            }
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
    chrome.storage.sync.remove("focusObj", function() {
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("getFocusFromUser(): " + error);
      }
    });
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