"use strict";
console.log("Connected");
let url = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?';
let quote = document.getElementById("quote");

let getQuote = (data) => quote.innerHTML = data.quoteText + " - " + (data.quoteAuthor || "Anonymous");

let handleErr = (error) => console.warn(error);

$.getJSON(url).done(getQuote).fail(handleErr);



