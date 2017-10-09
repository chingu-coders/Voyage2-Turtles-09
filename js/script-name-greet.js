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

}

function checkUserName() {
  getStoredUserName();
  console.log(storedUserName);
  if (storedUserName) {
    printUserName();
    $(".main-wrapper").fadeIn("slow");
  } else {
    $(".initial-wrapper").fadeIn("slow");
  }
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

function printUserName() {
  getStoredUserName();
  console.log(storedUserName);
  userNameHTMLId.innerHTML = storedUserName;
}

window.onload = () => {
  getStoredUserName();
  setGreeting();
  checkUserName();
  addEventListeners();
}

//Stage C - initial ideas
//Function for initial prompt asking for user name.
