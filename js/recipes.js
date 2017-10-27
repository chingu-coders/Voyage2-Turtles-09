(function recipes() {
  "use strict";

  // Create date timestamp for daily recipe
  let today = new Date();
  let timestamp = today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear();

  // Set up DOM variables
  const recipeThumbnail = document.querySelector(".recipe-thumbnail");
  const recipeTitle = document.querySelector(".recipe-title");
  const recipeCalories = document.querySelector(".recipe-calories .value");
  const recipeSource = document.querySelector(".recipe-source");
  const recipeDietLabels = document.querySelector(".recipe-diet-labels");
  const recipeHealthLabels = document.querySelector(".recipe-health-labels");
  const recipeReload = document.querySelector(".recipe-reload");

  // Action!
  getRecipe();

  // Listen for recipe reset
  recipeReload.addEventListener("click", function reload() {
    queryEdamam();
  })

  // ----------------------------------------------------------------------
  // Functions
  //

  function getRecipe() {
    // Check storage for saved recipe
    chrome.storage.sync.get("recipe", function(obj){
      // Error handling
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("Check Chrome storage for saved recipe: " + error);
      // If there's nothing in storage,
      // OR the saved recipe is not today's date, run the query
      } else if (!obj.recipe || (obj.recipe && obj.recipe.timestamp !== timestamp)) {
        queryEdamam();
      } else {
        recipePreview(obj.recipe);
      }
    });
  }

  // Query Edamam API
  function queryEdamam() {
    // Define default recipe search options
    let searchTerms = ["chicken", "beef", "pork", "fish", "seafood",
                        "vegetable", "pasta", "roast", "risotto",
                        "stew", "curry"
                        ]
    let dietOptions = ["balanced", "high-protein", "high-fiber",
                        "low-fat", "low-carb", "low-sodium"
                        ]

    // Build query url
    const api = "https://api.edamam.com/search";
    const app_id = "&app_id=" + "373a2755";
    const app_key = "&app_key=" + "5e414263cb40da6abf1019a550333f43";
    let search = "?q=" + searchTerms[rand(searchTerms.length)];
    let diet = "&diet=" + dietOptions[rand(dietOptions.length)];
    let range = "&to=" + "5";
    const query = api + search + app_id + app_key + diet + range;

    // Query Edamam
    $.getJSON(query, function(json) {
      console.log(json);

      // Set data variables (edm == edamam)
      let randomRecipe = rand(json.hits.length);
      let edmTitle = json.hits[randomRecipe].recipe.label;
      let edmImage = json.hits[randomRecipe].recipe.image;
      let edmCalories = Math.round(json.hits[randomRecipe].recipe.calories);
      let edmSource = json.hits[randomRecipe].recipe.source;
      let edmSourceUrl = json.hits[randomRecipe].recipe.url;
      let edmDietLabels = json.hits[randomRecipe].recipe.dietLabels;
      let edmHealthLabels = json.hits[randomRecipe].recipe.healthLabels;

      // Save query vars
      let savedRecipe = {
        title: edmTitle,
        timestamp: timestamp,
        source: edmSource,
        sourceUrl: edmSourceUrl,
        calories: edmCalories,
        diet: edmDietLabels,
        health: edmHealthLabels,
        thumbnail: edmImage
      }

      // Save to Chrome storage
      chrome.storage.sync.set({"recipe": savedRecipe});

      recipePreview(savedRecipe);
    });
  }

  // Display recipe preview with recipe data saved from API
  function recipePreview(recipe) {
    recipeThumbnail.setAttribute("src", recipe.thumbnail);
    recipeTitle.textContent = recipe.title;
    recipeDietLabels.innerHTML = listAry(recipe.diet, "<span>", "</span>");
    //recipeHealthLabels.textContent = recipe.health;
    recipeCalories.textContent = recipe.calories;
    recipeSource.textContent = recipe.source;
    recipeSource.setAttribute("href", recipe.sourceUrl);
  }

  // Get random number
  function rand(num) {
    return Math.floor(Math.random() * num);
  }

  // Return list of array items wrapped in a container
  function listAry(ary, containerOpen, containerClose) {
    let list = "";
    ary.forEach(function(e){ list += (containerOpen + e + containerClose) })
    return list
  }

})();
// Recipes ends