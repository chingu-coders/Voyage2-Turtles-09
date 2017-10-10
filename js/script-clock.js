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
  let current = new Date();
  let timeStringToPrint = current.toLocaleTimeString([], options);
  timeHTMLSelector.innerHTML = timeStringToPrint;
  console.log(timeStringToPrint);
}

function dblclickEventListener(){
  timeHTMLSelector.addEventListener("dblclick", () => {
    chrome.storage.sync.get(null, (obj) => {
      let error = chrome.runtime.lastError;
      switch (true) {
        case error:
          console.error(error);
          break;
        case obj.timeSetting.hour12:
          options = time24HourOptions;
          changeTime(options);
          break;
        case !obj.timeSetting.hour12:
          options = time12HourOptions;
          changeTime(options);
          break;
        default:
          options = time24HourOptions //Should be set to locale default
          changeTime(options);
      }
    chrome.storage.sync.set({"timeSetting": options});
  });
});}

$(document).ready(() => {
  pullTimeSetting();
  window.setInterval(changeTime, 30000);
});
