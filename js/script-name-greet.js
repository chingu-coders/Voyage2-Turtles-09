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
//Stage C - initial ideas

//This function turns the userName into a editable span so
//user can update their userName. 'Enter' would send the
//new userName to the database.
  userNameHTMLId.addEventListener("click", () => {
    console.log("Clicked!");
    userNameHTMLId.setAttribute("contenteditable", true);
  });

