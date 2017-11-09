"use strict";

(() => {
  function backgroundBackup() {
    let windowWidth = $(window).width();
    let windowHeight = $(window).height();
    let bgUrl = "url(";

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
      }

//Backup quotes
  const backupQuotes = [
    {1: {
      quoteAuthor: "Coach Brule",
      quoteText: "It's for your health!"
    }},
    {2: {
      quoteAuthor: "Warcraft 2 Elf",
      quoteText: "Time is of the essence"
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
      thumbnail: "https://www.edamam.com/web-img/b7a/b7a109912573f48845caf1bc242ce3f4.jpg",
      serves: 6,
      fat: 169,
      sugar: 23,
      carbs: "edmCarbs",
      protein: "edmProtein",
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
    }
  }];

    function selectBgRes() {
      switch (true) {
        case windowWidth <= defaultBg.lowRes.width || windowHeight <= defaultBg.lowRes.height:
          return defaultBg.lowRes.url;
          break;
        case windowWidth <= defaultBg.midRes.width || windowHeight <= defaultBg.midRes.height:
          return defaultBg.midRes.url;
          break;
        default:
          return defaultBg.highRes.url;
      }
    }

    bgUrl += selectBgRes();
    bgUrl += ") center center fixed / cover no-repeat";
    console.log(bgUrl);
    $(document.body).css("background", bgUrl);
  };

  backgroundBackup();
})();
