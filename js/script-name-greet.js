"use strict"

//Development aids
function clearStorage() {
  chrome.storage.sync.clear();
}
// Stage A - Production code
// Stage B - In development
let currentHour, greeting, newUserName//,storedUserName;
const storedUserName = {};
const nameEntryGreetingHTMLId = document.getElementById("nameEntryGreeting");
const nameEntryLineHTMLId = document.getElementById("nameEntryLine");
const greetingHTMLId = document.getElementById("greeting");
const userNameHTMLId = document.getElementById("userName");

function setGreeting() {
  currentHour = new Date().getHours();
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
  }
);
}

function addEventListeners() {
  nameEntryLineHTMLId.addEventListener("keydown", (event) => {
    if (event.which === 13) {
      event.preventDefault();
      if (nameEntryLineHTMLId.innerHTML) {
        document.activeElement.blur();
        newUserName = nameEntryLineHTMLId.innerHTML;
        chrome.storage.sync.set({"userName": newUserName});
        $(".initial-wrapper").fadeOut("slow", () => {
          printUserName();
          $(".main-wrapper").fadeIn("slow");
        });
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
    if (userNameHTMLId.innerHTML) {
      newUserName = userNameHTMLId.innerHTML;
      chrome.storage.sync.set({"userName": newUserName});
    } else {
      userNameHTMLId.innerHTML = storedUserName;
    }
    console.log(userNameHTMLId.innerHTML + " - new user name successfully submitted.");
  });
}

window.onload = () => {
  getStoredUserName();
  setGreeting();
  checkUserName();
  addEventListeners();
}

//Stage C - initial ideas
//Function for initial prompt asking for user name.
