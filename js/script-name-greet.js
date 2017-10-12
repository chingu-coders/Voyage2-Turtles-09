"use strict";

(() => {

const storedUserName = {};
const nameEntryGreetingHTMLId = document.getElementById("nameEntryGreeting");
const nameEntryLineHTMLId = document.getElementById("nameEntryLine");
const greetingHTMLId = document.getElementById("greeting");
const userNameHTMLId = document.getElementById("userName");

setGreeting();
checkUserName();

function setGreeting() {
  let greeting;
  let currentHour = new Date().getHours();

  if (currentHour > 2 && currentHour < 12) {
    greeting = "Morning";
  } else if (currentHour < 18){
    greeting = "Afternoon";
  } else {
    greeting = "Evening";
  }

  greetingHTMLId.innerHTML = "Good " + greeting + ", ";
  nameEntryGreetingHTMLId.innerHTML = "Hello, how are you this " + greeting + "?";
}

function checkUserName() {
  chrome.storage.sync.get(null, (obj) => {
    let error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    } else {
      storedUserName.userName = obj.userName;
      console.log(storedUserName.userName);

      if (storedUserName.userName) {
        userNameHTMLId.innerHTML = storedUserName.userName;
        $(".main-wrapper").fadeIn("slow");
      } else {
        $(".initial-wrapper").fadeIn("slow");
      }
    }
  });
  addUserNameListeners();
}

function addUserNameListeners() {
  let newUserName, whiteSpaceCheck;

  nameEntryLineHTMLId.addEventListener("keydown", (event) => {
    if (event.which === 13) {
      event.preventDefault();
      whiteSpaceCheck = whiteSpaceChecker();

      if (nameEntryLineHTMLId.innerHTML && whiteSpaceCheck) {
        document.activeElement.blur();
        newUserName = nameEntryLineHTMLId.innerHTML;
        chrome.storage.sync.set({"userName": newUserName});
        $(".initial-wrapper").fadeOut("slow", () => {
          userNameHTMLId.innerHTML = newUserName;
          $(".main-wrapper").fadeIn("slow");
        });
      } else {
        document.activeElement.blur();
        nameEntryLineHTMLId.innerHTML = '';
      }
    }
  });

  userNameHTMLId.addEventListener("click", () => {
    console.log("Clicked on user name.");
    userNameHTMLId.setAttribute("contenteditable", true);
    userNameHTMLId.addEventListener("keydown", (event) => {
      if (event.which === 13) {
        event.preventDefault();
        document.activeElement.blur();
      }
    });
  });

  userNameHTMLId.addEventListener("blur", () => {
    whiteSpaceCheck = whiteSpaceChecker();

    if (userNameHTMLId.innerHTML && whiteSpaceCheck) {
      newUserName = userNameHTMLId.innerHTML;
      chrome.storage.sync.set({"userName": newUserName});
    } else {
      userNameHTMLId.innerHTML = storedUserName.userName;
    }
    console.log(userNameHTMLId.innerHTML + " - new user name successfully submitted.");
  });
}

function whiteSpaceChecker() {
  let userNameCheck, matchVal;

  userNameCheck = (() => {
    let matchVal;
    let re = /\w[^&nbsp;]/;

    if ($(".main-wrapper").css("display") === "none") {
      matchVal = nameEntryLineHTMLId.innerHTML.search(re);
    } else {
      matchVal = userNameHTMLId.innerHTML.search(re);
    }

    if (matchVal !== -1) {
      return true;
    } else {
      return false;
    }
  })();

  if (!userNameCheck) {
    return false;
  } else {
    return true;
  }
}
})();
