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

  const greetingHTMLId = document.getElementById("greeting");
  console.log(greetingHTMLId);
  greetingHTMLId.innerHTML = "Good " + greeting;

  const userNameHTMLId = document.getElementById("userName");
  console.log(userNameHTMLId);
  userNameHTMLId.innerHTML = userName;
