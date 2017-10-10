"use strict";
const timeHTMLSelector = document.querySelector("#time");

const time24HourOptions = {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit'
};

const time12HourOptions = {
  hour12: true,
  hour: '2-digit',
  minute: '2-digit'
};

function pullTimeSetting (){
  //TODO: pull timeSetting from storage.
let options;

  if (timeSetting === "12-hour") {
    options = time12HourOptions;
  } else if (timeSetting === "24-hour") {
    options = time24HourOptions;
  } else {
    options = time24HourOptions;
  }
}

function changeTime(){
  current = new Date();
  timeStringToPrint = current.toLocaleTimeString([], options);
  document.getElementById("time").innerHTML = timeStringToPrint;
  console.log(timeStringToPrint);
}

$(document).ready(() => {
  pullTimeSetting();
  changeTime();
  window.setInterval(changeTime, 30000);
});
