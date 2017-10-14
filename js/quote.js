"use strict";
// Json file of hard-coded quotes
let url = 'https://gist.githubusercontent.com/dmakk767/9375ff01aff76f1788aead1df9a66338/raw/491f8c2e91b7d3b8f1c8230e32d9c9bc1a1adfa6/Quotes.json%2520';
let quote = document.getElementById("quote");
let quoteLinks = document.getElementById("quoteLinks");


let getQuote = (data) => {
    // Grabs a random quote from the json file
    let quoteSelected = data[Math.floor(Math.random() * data.length)];
    quote.innerHTML = quoteSelected.quote;
    // If no author then 'Anonymous'
    quoteLinks.innerHTML = "- " +(quoteSelected.name || "Anonymous") +
        '<button type="button" class="btn btn-default" aria-label="Left Align"><span class="glyphicon glyphicon-align-left" aria-hidden="true"></span></button>';
};
let handleErr = (error) => console.warn(error);


$.getJSON(url).then(data => getQuote(data)).fail(handleErr);



