"use strict";

let current, timeStringToPrint, time12HourOptions, time24HourOptions, options, timeSetting;

window.onload = () =>{
time24HourOptions = {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit'
};

time12HourOptions = {
  hour12: true,
  hour: '2-digit',
  minute: '2-digit'
}

function pullTimeSetting (){
  //TODO: pull timeSetting from storage.

  if (timeSetting === "12-hour") {
    options = time12HourOptions;
  } else if (timeSetting === "24-hour") {
    options = time24HourOptions;
  } else {
    options = time24HourOptions;
  }
}
