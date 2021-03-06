"use strict";
// Json file of hard-coded quotes
// let url = 'https://gist.githubusercontent.com/dmakk767/9375ff01aff76f1788aead1df9a66338/raw/491f8c2e91b7d3b8f1c8230e32d9c9bc1a1adfa6/Quotes.json%2520';

// Wrapping quote variables into an object to declutter the namespace
const quote = {
  renderQuote: document.getElementById("quote"),
  renderDetails: document.getElementById("quoteLinks"),
  saveQuote: document.getElementById("saveQuote"),
  twitter: "https://twitter.com/intent/tweet?text=",
  settings: {
    "async": true,
    "crossDomain": true,
    // TODO - Delete the following line of code (and these comments) before deploying to Chrome Web Store
    // url prepends a proxy to get around CORS issue (only needed during development)
    "url": "https://cors-anywhere.herokuapp.com/" + "https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en",
    // TODO uncomment the next line
    //"url": "https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en",
    "method": "GET"
  },
  handleErr: function handleErr (error) {console.warn(error);}

};

const handleQuote = {
  render: (data) => {

    let tweetBtn = `
        <!-- Tweet Button -->
      <span class="fa fa-twitter" id="tweet" aria-hidden="true"></span>`;
    let likeBtn = `<!-- Like Button -->
      <span class="fa fa-heart-o" id="saveQuote" aria-hidden="true"></span>
      `;

    quote.renderQuote.innerText = data.text;
    quote.renderDetails.innerHTML = ("- " + (data.author || "Anonymous") + tweetBtn + likeBtn);
    // Data is returned in order to resolve the promise triggering getTweet() in the promise chain

  },
  store: (data) => {
    chrome.storage.sync.set({
      "quote": {
        "text": data.quoteText,
        "author": data.quoteAuthor
      }
    });
  },
  tweet: () => window.open(quote.twitter + quote.renderQuote.innerText.trim() + " - " + (data.quoteAuthor || "Anonymous"), "_blank"),
  save: () => {
    // BTW SAVE ISN'T WORKING YET
    // Parses YYYY-MM-DD format

    let time = new Date().toISOString().slice(0, 10);
    let savedQuotes = JSON.parse(localStorage.getItem("quotes")) || null;
    let newQuote = {[time]: data.quoteText + " - " + (data.quoteAuthor || "Anonymous")};

    chrome.storage.local.set({"quotes": newQuote});
    chrome.storage.sync.get("quotes", function (storage) {
      console.log("Here's the new quote: " + newQuote);
    });

  }
};

const getQuote = (data) => {
  quote.renderQuote.innerText = data.quoteText;
  quote.renderDetails.html("").prepend("- " + (data.quoteAuthor || "Anonymous"));

  // Data is returned in order to resolve the promise triggering getTweet() in the promise chain
  return data;

};

// Renders API data, handles tweet and like functionality
const wrapData = function (data) {


  // Display Quote
  // getQuote(data);
  // Fire button functionality
  $("#tweet").on("click", handleQuote.tweet);
  $("#saveQuote").on("click", handleQuote.save);
  handleQuote.store(data);

};
// wrapData() passes API data to all handleQuote methods
$.getJSON(quote.settings).then(data => wrapData(data)).fail(quote.handleErr);

