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
  const focusEnterPrompt = document.querySelector("#focus-input-wrapper .focus-message");
  const focusEncouragement = document.querySelector("#focus-encouragement");
  const ENTER_MSG_DELAY = 4000;
  const REMOVE_MSG_DELAY = 1000;

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
    focusInput.addEventListener("input", displayEnterPrompt);
    focusInput.addEventListener("input", deteteEnterPrompt);
    focusInput.addEventListener("keydown", handleKeydown);

    function handleKeydown(event) {
      if (event.keyCode === 13){ //Enter key pressed
        focusInput.removeEventListener("input", displayEnterPrompt);
        focusInput.removeEventListener("input", deteteEnterPrompt);
        focusInput.removeEventListener("keydown", handleKeydown);
        if (this.value !== "") {
          focusObj.focusText = this.value;
          focusObj.focusTimestamp = Date.now();
          this.value = "";
          displayFocus(focusObj.focusText);
          chrome.storage.sync.set({focusObj}, function() {
            let error = chrome.runtime.lastError;
            if (error) {
              console.error("getFocusFromUser(): " + error);
            }
          });       
        }
      }
    }
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
    hideElement(focusEnterPrompt);
    getFocus();
  }

  function toggleOnFocusCompleted() {
    markAsComplete()
    focusObj.focusCompleted = true;
    chrome.storage.sync.set({focusObj});
    encourage();
  }

  function toggleOffFocusCompleted() {
    markAsIncomplete();
    focusObj.focusCompleted = false;
    chrome.storage.sync.set({focusObj});
  }

  function encourage() {
    focusEncouragement.innerHTML = "<p class='focus-message'><span class='loading'></span>Well done!</p>";
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

  /* Copied from https://davidwalsh.name/javascript-debounce-function */
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  /* Show or hide Enter prompt, when text is added to,
     or removed from the focus input box */
  let displayEnterPrompt = debounce(function() {
    /* if input box contains characters other than whitespace */
    if (/\S/.test(this.value)) {
      showElement(focusEnterPrompt);
    }    
    console.log("listener triggered");
  }, ENTER_MSG_DELAY);

  let deteteEnterPrompt = debounce(function() {
    /* if input box is empty, or contains only whitespace */
    if (this.value === "" || !/\S/.test(this.value)) {
      hideElement(focusEnterPrompt);
    }    
    console.log("listener triggered");
  }, REMOVE_MSG_DELAY);

})();

/* end of Main Focus */
