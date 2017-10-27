/* Main Focus */

(function mainFocus() {
  "use strict";

  const STORAGE = chrome.storage.sync;
  const focusInput = document.querySelector("#focus-input");
  const focusOutput = document.querySelector("#focus-output");
  const focusInWrapper = document.querySelector("#focus-input-wrapper");
  const focusOutWrapper = document.querySelector("#focus-output-wrapper");
  const focusDelete = document.querySelector(".focus-delete");
  const focusCheckbox = document.querySelector(".focus-checkbox");
  const focusUncheckedBox = document.querySelector(".fa-square-o");
  const focusCheckedBox = document.querySelector(".fa-check-square-o");
  const focusEncouragement = document.querySelector("#focus-encouragement");
  const focusInputMessage = document.querySelector("#focus-input-message");
  const congrats = ["Way to go!", "Great work!", "Good job!", "Nice!"];
  const ENTER_MSG_DELAY = 4000;
  const REMOVE_MSG_DELAY = 1000;
  let focusArr = [];
  let currentFocus;

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
    STORAGE.get("focusArray", function(obj){
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("getFocus(): " + error);
      }
      else {
        /* if there is, display it */
        if (obj.focusArray && obj.focusArray.length > 0) {
          focusArr = obj.focusArray;
          prepareFocusForDisplay();
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

  function prepareFocusForDisplay() {
    currentFocus = focusArr.pop();

    /* check if current focus has been completed */
    if (currentFocus.focusCompleted === true) {
      markAsComplete();
    }
    displayFocus(currentFocus.focusText);
  }

  function getFocusFromUser() {
    focusInput.addEventListener("input", displayEnterPrompt);
    focusInput.addEventListener("input", deleteEnterPrompt);
    focusInput.addEventListener("keydown", handleKeydown);
  }

  function displayFocus(focusText) {
    hideElement(focusInWrapper);
    focusInputMessage.innerHTML = "";
    focusOutput.innerHTML = focusText;
    showElement(focusOutWrapper);
  }

  function createFocusObject(focusText) {
    let timestamp = Date.now();
    let newObj = {"focusText": focusText || "", "focusCompleted": false, "focusTimestamp": timestamp};
    return newObj;
  }

  function deleteFocus() {
    focusArr.pop();
    STORAGE.set({"focusArray": focusArr}, function() {
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("getFocusFromUser(): " + error);
      }
    });
    if (focusArr.length === 0) {
      hideElement(focusOutWrapper);
      focusOutput.innerHTML = "";
      markAsIncomplete();
      currentFocus = {};
      getFocus();
    }
    else {
      currentFocus = focusArr.pop();
      displayFocus(currentFocus.focusText);
    }
    
  }

  function toggleOnFocusCompleted() {
    markAsComplete();
    currentFocus.focusCompleted = true;
    focusArr.pop();
    focusArr.push(currentFocus);
    STORAGE.set({"focusArray": focusArr});
    encourage();
  }

  function toggleOffFocusCompleted() {
    markAsIncomplete();
    currentFocus.focusCompleted = false;
    focusArr.pop();
    focusArr.push(currentFocus);
    STORAGE.set({"focusArray": focusArr});
  }

  function encourage() {
    let i = Math.floor(Math.random() * congrats.length);
    let congratsText = congrats[i];
    focusEncouragement.innerHTML = "<p class='focus-message focus-congrats'><span class='loading'></span>" + congratsText + "</p>";
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

  function handleKeydown(event) {
    if (event.keyCode === 13){ //Enter key pressed
      if (this.value !== "") {
        focusInput.removeEventListener("input", displayEnterPrompt);
        focusInput.removeEventListener("input", deleteEnterPrompt);
        focusInput.removeEventListener("keydown", handleKeydown);
        currentFocus = createFocusObject(this.value);
        this.value = "";
        displayFocus(currentFocus.focusText);
        focusArr.push(currentFocus);
        STORAGE.set({"focusArray": focusArr}, function() {
          let error = chrome.runtime.lastError;
          if (error) {
            console.error("getFocusFromUser(): " + error);
          }
        });
      }
    }
  }

  /* Adapted from code on https://davidwalsh.name/javascript-debounce-function */
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    let timeout;
    return function() {
      let context = this;
      let args = arguments;
      let later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  /* Show or hide Enter prompt, when text is added to,
     or removed from the focus input box */
  let displayEnterPrompt = debounce(function() {
    /* if input box contains characters other than whitespace */
    if (/\S/.test(this.value)) {
      focusInputMessage.innerHTML = "<p class='focus-message focus-enter'>Press enter to set your focus.</p>";
    }
  }, ENTER_MSG_DELAY);

  let deleteEnterPrompt = debounce(function() {
    /* if input box is empty, or contains only whitespace */
    if (this.value === "" || !/\S/.test(this.value)) {
      focusInputMessage.innerHTML = "";
    }
  }, REMOVE_MSG_DELAY);

})();

/* end of Main Focus */
