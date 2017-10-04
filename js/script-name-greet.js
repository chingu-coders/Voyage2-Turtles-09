"use strict"

window.onload = () => {
  //Development aids
  localStorage.setItem("userName", "David");

// Stage A - Production code
// Stage B - In development
  let currentHour, greeting, storedUserName;

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

  storedUserName = localStorage.getItem("userName");
  console.log(storedUserName);

  const greetingHTMLId = document.getElementById("greeting");
  console.log(greetingHTMLId);
  greetingHTMLId.innerHTML = "Good " + greeting;

  const userNameHTMLId = document.getElementById("userName");
  console.log(userNameHTMLId);
  userNameHTMLId.innerHTML = storedUserName;

//Stage C - initial ideas

//This function turns the userName into a editable span so
//user can update their userName. 'Enter' would send the
//new userName to the database.
  userNameHTMLId.addEventListener("click", () => {
    console.log("Clicked!");
    userNameHTMLId.setAttribute("contenteditable", true);
  });

}
