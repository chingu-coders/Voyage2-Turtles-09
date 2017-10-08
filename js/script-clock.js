"use strict";

let current, timeStringToPrint, time12HourOptions, time24HourOptions, options, timeSetting;

window.onload = () =>{
  currentDate = new Date();
  console.log(currentDate);
  currentHour = currentDate.getHours();
  currentMinute = currentDate.getMinutes();
  currentTime = currentHour + ": " + currentMinute;
  console.log(currentTime);

  defaultLocaleTimeString = currentDate.toLocaleTimeString().split('').slice(0,4).join('');
  console.log(stringDate);
}
