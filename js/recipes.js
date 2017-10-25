(function recipes() {
  "use strict";

  // Create date timestamp for daily recipe
  let today = new Date();
  let timestamp = today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear();

  // Set up DOM variables
  const recipeThumbnail = document.querySelector(".recipe-thumbnail");
  const recipeTitle = document.querySelector(".recipe-title");
  const recipeCalories = document.querySelector(".recipe-calories .value");
  const recipeDailyValue = document.querySelector(".recipe-daily-value .value");
  const recipeSource = document.querySelector(".recipe-source");

  // Define default recipe search options
  let searchTerms = ["chicken",
                     "beef",
                     "pork",
                     "fish",
                     "seafood",
                     "vegetable",
                     "pasta",
                     "roast",
                     "risotto",
                     "stew",
                     "curry"
                     ]
  let dietOptions = ["balanced",
                     "high-protein",
                     "high-fiber",
                     "low-fat",
                     "low-carb",
                     "low-sodium"
                     ]

  // Build API URL
  const api = "https://api.edamam.com/search?q=";
  let search = searchTerms[rand(searchTerms.length)];
  const app_id = "&app_id=373a2755";
  const app_key = "&app_key=5e414263cb40da6abf1019a550333f43";
  let options = "";
  const query = api + search + app_id + app_key + options;

  // Check storage for saved recipe
  chrome.storage.sync.get("recipe", function(obj){
    // Check for errors
    let error = chrome.runtime.lastError;
    if (error) {
      console.error("checkRecipe(): " + error);
    // If there's nothing in storage,
    // OR the saved recipe is not today's date, run the query
    } else /*if (!obj.recipe || (obj.recipe && obj.recipe.timestamp !== timestamp))*/ {
      queryEdamam();
    }
    // Display recipe preview in browser
    recipePreview(obj.recipe);

  });

  // Query Edamam API
  function queryEdamam() {
    $.getJSON(query, function(json) {

      console.log(json);

      // Set data variables (edm == edamam)
      let randomRecipe = rand(json.hits.length);
      let edmTitle = json.hits[randomRecipe].recipe.label;
      let edmImage = json.hits[randomRecipe].recipe.image;
      let edmCalories = Math.round(json.hits[randomRecipe].recipe.calories);
      let edmSource = json.hits[randomRecipe].recipe.source;
      let edmSourceUrl = json.hits[randomRecipe].recipe.url;

      let savedRecipe = {
        timestamp: timestamp,
        thumbnail: edmImage,
        title: edmTitle,
        calories: edmCalories,
        source: edmSource,
        sourceUrl: edmSourceUrl
      }

      // Save to Chrome storage
      chrome.storage.sync.set({"recipe": savedRecipe});
    });
  }

  // Display recipe preview with recipe data saved from API
  function recipePreview(recipe) {
    recipeThumbnail.setAttribute("src", recipe.thumbnail);
    recipeTitle.textContent = recipe.title;
    recipeCalories.textContent = recipe.calories;
    recipeSource.textContent = recipe.source;
    recipeSource.setAttribute("href", recipe.sourceUrl);
  }

  // Get random number
  function rand(num) {
    return Math.floor(Math.random() * num);
  }

})();
// Recipes ends