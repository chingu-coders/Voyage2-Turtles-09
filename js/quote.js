"use strict";
// Json file of hard-coded quotes
// let url = 'https://gist.githubusercontent.com/dmakk767/9375ff01aff76f1788aead1df9a66338/raw/491f8c2e91b7d3b8f1c8230e32d9c9bc1a1adfa6/Quotes.json%2520';

// Wrapping quote variables into an object to declutter the namespace
const quote = {
    renderQuote: document.getElementById("quote"),
    renderDetails: document.getElementById("quoteLinks"),
    twitter: 'https://twitter.com/intent/tweet?text=',
    settings: {
        "async": true,
        "crossDomain": true,
        // url prepends a proxy to get around CORS issue
        "url": "https://cors.io/?" + "https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en",
        "method": "GET"
        },
        handleErr: function handleErr (error) {console.warn(error);}

};

const getQuote = (data) => {
    quote.renderQuote.innerText = data.quoteText;
    quote.renderDetails.prepend("- " + (data.quoteAuthor || 'Anonymous'));

    // Data is returned in order to resolve the promise triggering getTweet() in the promise chain
    return data;

};
const getTweet = (data) => {
    const tweet = () => window.open(twitter + quote.renderQuote.innerText.trim() + " - " + (data.quoteAuthor || 'Anonymous'), "_blank");
    $("#tweet").on("click", tweet);
};

// Choosing to chain promises rather than call getTweet from within getQuote
$.getJSON(quote.settings).then(data => getQuote(data)).then(data => getTweet(data)).fail(quote.handleErr);



