"use strict"

window.onload = (() => {
  let currentHour, greeting, userName;

  currentHour = new Date().getHours();
  console.log(currentHour);

  if (currentHour > 2 && currentHour < 12) {
    greeting = "Morning, "
  } else if (currentHour < 18){
    greeting = "Afternoon, "
  } else {
    greeting = "Evening, "
  }
  console.log(greeting);

  userName = "test user";
  console.log(userName);

  const userNameHTMLId = document.getElementById("greeting");
  console.log(userNameHTMLId);
  userNameHTMLId.innerHTML = "Good " + greeting + userName + ".";
})
