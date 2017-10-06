"use strict";

let currentDate, currentHour, currentMinute, currentTime, stringDate;

window.onload = () =>{
  currentDate = new Date();
  console.log(currentDate);
  currentHour = currentDate.getHours();
  currentMinute = currentDate.getMinutes();
  currentTime = currentHour + ": " + currentMinute;
  console.log(currentTime);

  stringDate = currentDate.toLocaleTimeString();
  console.log(stringDate);
}
