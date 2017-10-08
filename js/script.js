"use strict";

/* Main Focus */
(function() {
  const focusInput = document.querySelector("#focus-input");
  const focusOutput = document.querySelector("#focus-output");
  const focusOutWrapper = document.querySelector("#focus-output-wrapper");
  const focusInWrapper = document.querySelector("#focus-input-wrapper");
  const focusClose = document.querySelector(".focus-close");
  const focusUncheckedBox = document.querySelector(".fa-square-o");
  const focusCheckedBox = document.querySelector(".fa-check-square-o");
  let focusText;
  let currentCheckbox = focusUncheckedBox;

  getFocus();

  focusOutWrapper.addEventListener("mouseover", function(event) {
    showElement(focusClose);
    showElement(currentCheckbox);
  });

  focusOutWrapper.addEventListener("mouseleave", function(event) {
    hideElement(focusClose);
    hideElement(currentCheckbox);
  });

  focusCheckedBox.addEventListener("click", function() {
    toggleFocusCompleted();
  });

  focusUncheckedBox.addEventListener("click", function() {
    toggleFocusCompleted();
  });

  focusClose.addEventListener("click", function() {
    deleteFocus();
  });

  function toggleFocusCompleted() {
    if (currentCheckbox === focusUncheckedBox) {
      currentCheckbox = focusCheckedBox;
      showElement(focusCheckedBox);
      hideElement(focusUncheckedBox);
      focusOutput.classList.add("focus-completed");
      chrome.storage.sync.set({"focusCompleted": true});
    }
    else {
      currentCheckbox = focusUncheckedBox;
      showElement(focusUncheckedBox);
      hideElement(focusCheckedBox);
      focusOutput.classList.remove("focus-completed");
      chrome.storage.sync.set({"focusCompleted": false});
    }
  }

  function getFocus() {
    /* Is there already a focus in storage? */
    chrome.storage.sync.get(null, function(obj){ // null gets whole object
      /* if there is, display it */    
      if (obj.focus !== undefined) {
        /* check if focus has been completed */
        if (obj.focusCompleted === true) {
          focusOutput.classList.add("focus-completed");
          currentCheckbox = focusCheckedBox;
        }
        /* TODO figure out if the else statement is needed */
        else {
          focusOutput.classList.remove("focus-completed");
        }
        showElement(focusOutWrapper);
        displayFocus(obj.focus);
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
          chrome.storage.sync.set({"focus": focusText, "focusCompleted": false, "focusTimestamp": Date.now()}, function() {
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
    chrome.storage.sync.remove(["focus", "focusCompleted", "focusTimestamp"]);
    hideElement(focusOutWrapper);
    focusOutput.innerHTML = "";
    focusOutput.classList.remove("focus-completed");
    showElement(focusUncheckedBox);
    hideElement(focusCheckedBox);
    currentCheckbox = focusUncheckedBox;
    getFocus();
  }

})();
