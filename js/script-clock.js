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

let options;

function pullTimeSetting (){
  chrome.storage.sync.get(null, (obj) => {
    let error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    } else if (!obj.timeSetting){
      console.log(obj.timeSetting);
      options = time24HourOptions //Should be set to locale default
      changeTime(options);
      dblclickEventListener()
    } else {
      console.log(obj.timeSetting);
      options = obj.timeSetting;
      changeTime(options);
      dblclickEventListener();
    }
  });
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
