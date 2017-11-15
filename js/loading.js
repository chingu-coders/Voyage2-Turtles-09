"use strict";

(() => {

//Backup quotes
  const backupQuotes = [
    {1: {
      author: "Coach Brule",
      text: "It's for your health!"
    }},
    {2: {
      author: "Forrest Gump",
      text: "My mama always said, 'Life was like a box of chocolates; you never know what you're gonna get'."
    }},
    {3: {
      author: "Ferris Bueller",
      text: "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it."
    }}
  ];

//Backup recipes
  const backupRecipes = [{
    1: {
      title: "Seafood Chowder",
      timestamp: "6-11-2017",
      source: "http://www.saveur.com/article/Recipes/Seafood-Chowder",
      calories: 2405,
      diet: ["Low-Carb"],
      thumbnail:"https://www.edamam.com/web-img/e12/e12b8c5581226d7639168f41d126f2ff.jpg",
      serves: 4,
      fat: 169,
      sugar: 23,
      carbs: 9,
      protein: 28,
      notes: []
    },
    2: {
      title: "Easy Bacon Wrapped Dates",
      timestamp: "6-11-2017",
      source:	"http://www.foodista.com/recipe/SLVGRM3L/easy-bacon-wrapped-dates",
      calories: 126,
      diet:	["Low-​Sodium", "Dairy-​Free", "Gluten-​Free"],
      thumbnail: "https://www.edamam.com/web-img/572/572501149c4d1b27aa5736a6dae7f778.jpg",
      serves: 12,
      fat: 6,
      sugar: 16,
      carbs: 18,
      protein: 2,
      notes: []
    },
    3: {
      title: "Chicken Paprikash",
      timestamp: "9-11-2017",
      source:	"http://norecipes.com/recipe/chicken-paprikash/",
      calories: 3103,
      diet:	["Low-​Carb"],
      thumbnail: "https://www.edamam.com/web-img/572/572501149c4d1b27aa5736a6dae7f778.jpg",
      serves: 4,
      fat: 208,
      sugar: 24,
      carbs: 16,
      protein: 60,
      notes: []
    }
  }];

  const dataCheck = {
    background: null,
    quote: null,
    recipe: null
  };

  const defaultBg = {
    lowRes: {
      url: "assets/default-bg-low-res.jpg",
      width: 1250,
      height: 834
    },
    midRes: {
      url: "assets/default-bg-mid-res.jpg",
      width: 2200,
      height: 1469
    },
    highRes: {
      url: "assets/default-bg-high-res.jpg",
      width: 5120,
      height: 3418
    },
    selectBgRes: () => {
      let windowWidth = $(window).width();
      let windowHeight = $(window).height();

      switch (true) {
        case windowWidth <= defaultBg.lowRes.width || windowHeight <= defaultBg.lowRes.height:
          return defaultBg.lowRes.url;
        case windowWidth <= defaultBg.midRes.width || windowHeight <= defaultBg.midRes.height:
          return defaultBg.midRes.url;
        default:
          return defaultBg.highRes.url;
      }
    }
  };

  const backups = {
    background: ()=>{
      console.log("Hi, I'm the backgroundBackup func!");
      let bgUrl = "url(";
      bgUrl += defaultBg.selectBgRes();
      bgUrl += ") center center fixed / cover no-repeat";

      $("#loaded-wrapper").css("background", bgUrl);
      bg.renderLocation.innerHTML = "Leeds";
      bg.renderPhotographer.innerHTML = "<a href='https://unsplash.com/joannakosinska/portfolio'>Joanna Kosinska</a>" || "<a href='https://unsplash.com/@joannakosinska'>@joannakosinska</a>";
    },

    quote: ()=>{
      console.log("Hi, I'm the quoteBackup func!");
      let n = rand(backupQuotes.length);
      let data = backupQuotes[n][n + 1];
      chrome.storage.sync.set({"quote": data});
      handleQuote.render(data);
    },

    recipe: ()=>{
      console.log("Hi, I'm the recipeBackup func!");
      let n = rand(backupRecipes.length);
      let savedRecipe = backupRecipes[n][n + 1];
      chrome.storage.sync.set({"recipe": savedRecipe});
      recipes.recipePreview(savedRecipe);
    }
  };

  const printAPIData = {
    background: () => {
      chrome.storage.sync.get(null, function (data) {
        let savedBg = data["bg_url"];
        let savedPhotographer = data["photographer"];
        let savedLocation = data["location"];
        let savedLinkToUser = data["link"];
        let savedUsername = data["username"];
        $(".loaded-wrapper").css("background", `#f3f3f3 url('${savedBg}') center center fixed / cover no-repeat`);
        bg.renderLocation.innerHTML = `${savedLocation}` || `${imageDescriptionData}`;
        bg.renderPhotographer.innerHTML = `<a href="${savedLinkToUser}">${savedPhotographer}</a>` || `<a href="${linkToUser}">${savedUsername}</a>`;
      });
    },
    quote: () => {
      chrome.storage.sync.get(null, (obj) => {
        let quote = obj.quote;
        handleQuote.render(quote);
      });
    },
    recipe: () => {
      chrome.storage.sync.get(null, (obj) => {
        let recipe = obj.recipe;
        recipes.recipePreview(recipe);
      });
    }
  };

  const backupChecker = {
    timeout: () => {
      let timerId = setTimeout(function runChecker() {
        backupChecker.storageCheck();
        if (backupChecker.complete) {
          console.log("Check complete!");
          clearTimeout(timerId);
          showWrapperToDisplay();
        } else {
          timerId = setTimeout(runChecker, 10);
        }
      }, 10);

      setTimeout(() => {
        clearTimeout(timerId);
        if (!backupChecker.complete){
          backupChecker.runBackup();
          showWrapperToDisplay();
        }
      }, 3000);
    },

    storageCheck: () => {
      chrome.storage.sync.get(null, (obj) => {
        let error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        } else {
          dataCheck.background = obj["bg_url"];
          dataCheck.quote = obj.quote;
          dataCheck.recipe = obj.recipe;

          if (dataCheck.background && dataCheck.quote && dataCheck.recipe) {
            backupChecker.complete = true;
            $.each(printAPIData, (key) => {
              printAPIData[key]();
            });
          } else {
            backupChecker.complete = false;
          }
        }
      });
    },

    runBackup: () => {
      $.each(dataCheck, (key, value) => {
        if (!value) {
          console.log("Running backups method for:", key);
          backups[key]();
        } else {
          printAPIData[key]();
        }
      });
    },
  };

//Function for running through backupChecker for a certain interval
  backupChecker.timeout();

// Execute when decision to print which data has been made

  function showWrapperToDisplay() {
    let wrapperToDisplay = window.localStorage.getItem("wrapperToDisplay");
    localStorage.removeItem("wrapperToDisplay");
    $("#loading-wrapper").fadeOut("fast", () => {
      $("#loaded-wrapper").fadeIn("slow", () => {
        $(wrapperToDisplay).show();
      });
    });
  }

  function rand(num) {
    return Math.floor(Math.random() * num);
  }
})();
