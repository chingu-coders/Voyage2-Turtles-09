"use strict";

// VARS
const bg = document.querySelector("#bg");
const api = "https://api.unsplash.com/photos/random";
const appID = "51eeacda52a858956883fcd86384424f78d38da8fb4f8b61b65723e41223d6b1";
const query = api + "?client_id=" + appID + "&collections=488341";



// PASS IMAGE TO #BG DIV
fetch(query).then( response => response.json()).then( data =>
    {

        let bgUrl = data.urls.regular;
        document.body.style.background = `#f3f3f3 url('${bgUrl}') center center fixed / cover no-repeat`;

    });





