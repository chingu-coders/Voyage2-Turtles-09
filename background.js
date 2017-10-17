 "use strict";

	const bg = {
		defaultBgUrl: "https://images.unsplash.com/photo-1473800447596-01729482b8eb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=40eba4c15ec393c84db9c76380d26869",
		query: "https://api.unsplash.com/photos/random?collections=1291922" + "&client_id=" + "51eeacda52a858956883fcd86384424f78d38da8fb4f8b61b65723e41223d6b1",
		renderPhotographer: document.querySelector("#image-photographer"),
		renderLocation: document.querySelector("#image-location"),
	};

	function queryUnsplash () {
		console.log("Running queryUnsplash...");
		fetch(bg.query).then(response => response.json()).then(data =>
		{
			// IMAGE DATA VARS
			let bgUrl = data.urls.regular;
			let photographerData = data.user.name;
			let imageDescriptionData = data.description;
			let username = data.user.username;
			let linkToUser = `https://unsplash.com/@${username}?utm_source=over&utm_medium=referral&utm_campaign=api-credit`;
			let imageLocationData = data.user.location || username;

			// SAVE BG URL TO STORAGE
			chrome.storage.sync.set ({
				"bg_url": bgUrl,
				"photographer": photographerData,
				"location": imageLocationData,
				"username": username,
				"link": linkToUser
			});

			// SET BG
			console.log(data);
			document.body.style.background = `#f3f3f3 url('${bgUrl}') center center fixed / cover no-repeat`;

			// IMAGE DATA
			bg.renderLocation.innerHTML =`${imageLocationData}` || `{imageDescriptionData}`;
			bg.renderPhotographer.innerHTML =`<a href="${linkToUser}">${photographerData}</a>` || `<a href="{linkToUser}">${username}</a>`;
		});
	}

	(function (){
		var currentTimeStamp = Date.now();
		chrome.storage.sync.get("time_stamp", function(data) {
			var prevTimeStamp = data["time_stamp"];

			// Querying local storage first to see if last time is available
			if (prevTimeStamp !== undefined) {
				// Checking if 30s have elapsed since the time recorded in storage
				if (currentTimeStamp - prevTimeStamp >= 5000) {
					//* Updating the previous time stamp in storage to the current time
					prevTimeStamp = currentTimeStamp;
					chrome.storage.sync.set({"time_stamp": prevTimeStamp});
					console.log("Now in local storage: " + data["time_stamp"] + "Curr: " + currentTimeStamp);
					//* Fetching a new background from unsplash
					queryUnsplash();
				} else {
					// Setting BG url to the last stored BG using null to get the entire object
					chrome.storage.sync.get(null, function (data) {
						let savedBg = data["bg_url"];
						let savedPhotographer = data["photographer"];
						let savedLocation = data["location"];
						let savedLinkToUser = data["link"];
						let savedUsername = data["username"];
						document.body.style.background = `#f3f3f3 url('${savedBg}') center center fixed / cover no-repeat`;
						bg.renderLocation.innerHTML = `${savedLocation}` || `{imageDescriptionData}`;
						bg.renderPhotographer.innerHTML = `<a href="${savedLinkToUser}">${savedPhotographer}</a>` || `<a href="{linkToUser}">${savedUsername}</a>`;
						console.log("Using last saved BG");
					});

					console.log(data);
				}
			} else {
				// If there is no timestamp, current time is stored
				prevTimeStamp = currentTimeStamp;
				chrome.storage.sync.set({"time_stamp": prevTimeStamp});
				queryUnsplash();
				console.log("No time here.")
			}
		})
	})();

	// FOCUS BACKGROUND
	(function () {
		const mouseOverFocus = () => {
			$("#bottom-row").siblings().fadeOut();
			$(".floater-box").siblings().fadeOut();
		};

		let timer ;

		const mouseOutFocus = () => {
			$("#bottom-row").siblings().fadeIn();
			$(".floater-box").siblings().fadeIn();
			clearTimeout(timer);
		};

        $(".floater-box").mouseenter( () => {
            timer = window.setTimeout(mouseOverFocus, 3000);
        });
        $(".floater-box").mouseleave( () => {
            clearTimeout(timer);
            window.setTimeout(mouseOutFocus, 500);
        });
    })();

















