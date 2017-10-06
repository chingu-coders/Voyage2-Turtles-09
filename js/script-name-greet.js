"use strict"

window.onload = () => {
  //Development aids
  //localStorage.setItem("userName", "David");

// Stage A - Production code
// Stage B - In development
  let currentHour, greeting, storedUserName, newUserName;

  currentHour = new Date().getHours();
  console.log(currentHour);

  if (currentHour > 2 && currentHour < 12) {
    greeting = "Morning"
  } else if (currentHour < 18){
    greeting = "Afternoon"
  } else {
    greeting = "Evening"
  }
  console.log(greeting);

  storedUserName = localStorage.getItem("userName");
  console.log(storedUserName);

  const greetingHTMLId = document.getElementById("greeting");
  console.log(greetingHTMLId);
  greetingHTMLId.innerHTML = "Good " + greeting + ", ";

  const userNameHTMLId = document.getElementById("userName");
  console.log(userNameHTMLId);
  userNameHTMLId.innerHTML = storedUserName;

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

//Stage C - initial ideas
//Function for initial prompt asking for user name.
const nameEntryGreetingHTMLId = document.getElementById("nameEntryGreeting");
nameEntryGreetingHTMLId.innerHTML = "Hello, how are you this " + greeting + "?";

const nameEntryLineHTMLId = document.getElementById("nameEntryLine");

if (storedUserName) {
  $(".initial-wrapper").css("display", "none");
} else {
  $(".main-wrapper").css("display", "none");
}

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

}
