    "use strict";
    // VARS
    const bg = document.querySelector("#bg");
    const api = "https://api.unsplash.com/photos/random";
    const appID = "51eeacda52a858956883fcd86384424f78d38da8fb4f8b61b65723e41223d6b1";
    const query = api + "?client_id=" + appID + "&collections=488341";
    const imgPhotographer = document.querySelector("#image-photographer");
    const imgLocation = document.querySelector("#image-location");

    fetch(query).then( response => response.json()).then( data =>
    {
        // IMAGE DATA VARS
        let bgUrl = data.urls.regular;
        let photographerData = data.user.name;
        // let imageLocationData = data.location.name;
        // let imageLocation = data.location.title;
        let imageDescriptionData = data.description;
        let username = data.user.username;
        let linkToUser = `https://unsplash.com/@${username}?utm_source=over&utm_medium=referral&utm_campaign=api-credit`;
        let imageLocationData = data.user.location || "Photo Credits";


        // SET BG
        console.log(data);
        document.body.style.background = `#f3f3f3 url('${bgUrl}') center center fixed / cover no-repeat`;

        // IMAGE DATA
        imgLocation.innerHTML =`${imageLocationData}` || `{imageDescriptionData}`;
        imgPhotographer.innerHTML =`<a href="${linkToUser}">${photographerData}</a>` || `<a href="{linkToUser}">${username}</a>`;

        // FOCUS BACKGROUND
        $(".credit-box").click( function() {
            $("#bottom-row").siblings().fadeOut();
            $(".credit-box").siblings().fadeOut();
        });
    });







