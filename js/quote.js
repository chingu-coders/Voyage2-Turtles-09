"use strict";
// Json file of hard-coded quotes
// let url = 'https://gist.githubusercontent.com/dmakk767/9375ff01aff76f1788aead1df9a66338/raw/491f8c2e91b7d3b8f1c8230e32d9c9bc1a1adfa6/Quotes.json%2520';
let quote = document.getElementById("quote");
let quoteLinks = document.getElementById("quoteLinks");
let proxy2 = "https://cors.io/?";
const twitter = 'https://twitter.com/intent/tweet?text=';
let settings = {
    "async": true,
    "crossDomain": true,
    "url": proxy2 + "https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en",
    "method": "GET",
};

const handleErr = (error) => console.warn(error);
const getQuote = (data) => {
    quote.innerText = data.quoteText;
    quoteLinks.prepend("- " + (data.quoteAuthor || 'Anonymous'));
    return data;

};
const getTweet = (data) => {
    console.log("get tweet is running");
    const tweet = () => window.open(twitter + quote.innerText.trim() + " - " + (data.quoteAuthor || 'Anonymous'), "_blank");
    $("#tweet").on("click", tweet);
};

$.getJSON(settings).then(data => getQuote(data)).then(data => getTweet(data)).fail(handleErr);



