    "use strict";
    (function() {}());
    // VARS
    const api = "https://api.unsplash.com/photos/random";
    const appID = "51eeacda52a858956883fcd86384424f78d38da8fb4f8b61b65723e41223d6b1";
    const query = api + "?client_id=" + appID + "&collections=488341";
    const imgPhotographer = document.querySelector("#image-photographer");
    const imgLocation = document.querySelector("#image-location");
    const test = document.querySelector("#bottom-row");
    const defaultBgUrl = "https://images.unsplash.com/photo-1473800447596-01729482b8eb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=40eba4c15ec393c84db9c76380d26869";

    // QUERY LOCAL STORAGE
    var currentTimeStamp = Date.now();

    chrome.storage.sync.get("time_stamp", function(data) {
        var prevTimeStamp = data["time_stamp"];

        //* Querying local storage first to see if last time is available
        if(prevTimeStamp !== undefined) {
            console.log("There's a time here");
            //* Checking if 30s have elapsed since the time recorded in storage
            if(currentTimeStamp - prevTimeStamp >= 30000) {
                //* Updating the previous time stamp in storage to the current time
                prevTimeStamp = currentTimeStamp;
                chrome.storage.sync.set({"time_stamp": prevTimeStamp});
                console.log("Now in local storage: " + data["time_stamp"] + "Curr: " + currentTimeStamp);
                //* Fetching a new background from unsplash
                queryUnsplash();
            } else {
                //* Setting BG url to the last stored BG
                chrome.storage.sync.get("bg_url", function(data) {
                    let savedBg = data["bg_url"];
                    document.body.style.background = `#f3f3f3 url('${savedBg}') center center fixed / cover no-repeat`;
                    console.log("Using last saved BG");
                });

                console.log(data);
            }
        } else {
            //* If there is no timestamp, current time is stored
            prevTimeStamp = currentTimeStamp;
            chrome.storage.sync.set({"time_stamp": prevTimeStamp});
            queryUnsplash();
            console.log("No time here.")
        }
    });





    function queryUnsplash () {
        console.log("Running queryUnsplash...");
        fetch(query).then( response => response.json()).then( data =>
        {
            // IMAGE DATA VARS
            let bgUrl = data.urls.regular;
            let photographerData = data.user.name;
            let imageDescriptionData = data.description;
            let username = data.user.username;
            let linkToUser = `https://unsplash.com/@${username}?utm_source=over&utm_medium=referral&utm_campaign=api-credit`;
            let imageLocationData = data.user.location || "Photo Credits";

            // SAVE BG URL TO STORAGE
            chrome.storage.sync.set({"bg_url": bgUrl});




            // SET BG
            console.log(data);
            document.body.style.background = `#f3f3f3 url('${bgUrl}') center center fixed / cover no-repeat`;

            // IMAGE DATA
            imgLocation.innerHTML =`${imageLocationData}` || `{imageDescriptionData}`;
            imgPhotographer.innerHTML =`<a href="${linkToUser}">${photographerData}</a>` || `<a href="{linkToUser}">${username}</a>`;



        });
    }




    // FOCUS BACKGROUND
    const mouseOverFocus = () => {
        $("#bottom-row").siblings().fadeOut();
        $(".credit-box").siblings().fadeOut();
    };

    let timer ;

    const mouseOutFocus = () => {
        $("#bottom-row").siblings().fadeIn();
        $(".credit-box").siblings().fadeIn();
        clearTimeout(timer);
    };

    $(".credit-box").mouseenter( () => {
        timer = window.setTimeout(mouseOverFocus, 3000);
    });
    $(".credit-box").mouseleave( () => {
        clearTimeout(timer);
        window.setTimeout(mouseOutFocus, 500);
    });














