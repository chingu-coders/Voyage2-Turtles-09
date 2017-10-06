"use strict"

  //Development aids
  //localStorage.setItem("userName", "David");

// Stage A - Production code
// Stage B - In development
let currentHour, greeting, storedUserName, newUserName;
const nameEntryGreetingHTMLId = document.getElementById("nameEntryGreeting");
const nameEntryLineHTMLId = document.getElementById("nameEntryLine");
const greetingHTMLId = document.getElementById("greeting");
const userNameHTMLId = document.getElementById("userName");

function getStoredUserName() {
  storedUserName = localStorage.getItem("userName");
}

function checkUserName() {
  if (storedUserName) {
    $(".initial-wrapper").css("display", "none");
  } else {
    $(".main-wrapper").css("display", "none");
  }
}

function addEventListeners() {
  nameEntryLineHTMLId.addEventListener("keydown", (event) => {
    if (event.which === 13) {
      event.preventDefault();
      if (nameEntryLineHTMLId.innerHTML) {
        document.activeElement.blur();
        newUserName = nameEntryLineHTMLId.innerHTML;
        localStorage.setItem("userName", newUserName);
        $(".initial-wrapper").fadeOut("slow", () => {
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
      localStorage.setItem("userName", newUserName);
    } else {
      userNameHTMLId.innerHTML = storedUserName;
    }
    console.log(userNameHTMLId.innerHTML + " - new user name successfully submitted.");
  });
}

function greeting() {
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

window.onload = () => {
  declarations();
  getStoredUserName();
  greeting();
  checkUserName();
  addEventListeners();
}

//Stage C - initial ideas
//Function for initial prompt asking for user name.

}
