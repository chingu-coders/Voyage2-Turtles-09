"use strict";

// VARS
const bg = document.querySelector("#bg");
const api = "https://api.unsplash.com/photos/random";
const appID = "51eeacda52a858956883fcd86384424f78d38da8fb4f8b61b65723e41223d6b1";
const query = api + "?client_id=" + appID + "&collections=324965" + "&h=320&w=320";
var bgUrl;

// FETCH UNSPLASH
// const option = {
//     method: "GET",
//     // body: JSON.stringify({
//     //     "query": "health",
//     //     "w": "320",
//     //     "h": "320"
//     // }),
//     headers: {
//         "Content-Type": "application/json",
//         "Accept-Version": "v1"
//     },
//     authorization: "51eeacda52a858956883fcd86384424f78d38da8fb4f8b61b65723e41223d6b1",
//     // applicationId: "51eeacda52a858956883fcd86384424f78d38da8fb4f8b61b65723e41223d6b1",
//     // secret: "f69cfd800bc7a3ae0b809f2ad4ebdf2f13a1435e62ebe13610ed8cf96aca861f",
//     // callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
//
// };

// PASS IMAGE TO #BG DIV
fetch(query).then( response => response.json()).then( data =>
    {
        console.log(data);
        bgUrl = data.urls.regular;
        // bg.style.backgroundImage=`url(${bgUrl}) no-repeat center center cover`;
        document.body.style.background = `#f3f3f3 url('${bgUrl}') no-repeat center center fixed`;
    });





