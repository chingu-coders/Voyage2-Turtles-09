function recipes() {
  "use strict";

  // Create date timestamp for daily recipe
  let today = new Date();
  let timestamp = today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear();

  // Set up DOM variables
  const recipeThumbnail = document.querySelector(".recipe-thumbnail");
  const recipeTitle = document.querySelector(".recipe-title");
  const recipeCalories = document.querySelector(".recipe-calories .value");
  const recipeSource = document.querySelector(".recipe-source a");
  const recipeDietLabels = document.querySelector(".recipe-diet-labels");
  const recipeHealthLabels = document.querySelector(".recipe-health-labels");
  const recipeFat = document.querySelector(".recipe-nutrients-fat .value");
  const recipeSugar = document.querySelector(".recipe-nutrients-sugar .value");
  const recipeServes = document.querySelector(".recipe-serves .value");
  const recipeCarbs = document.querySelector(".recipe-nutrients-carbs .value");
  const recipeProtein = document.querySelector(".recipe-nutrients-protein .value");
  const recipeNotes = document.querySelector(".recipe-notes");
  const recipeReload = document.querySelector(".recipe-reload");
  const ingredientPref = document.querySelectorAll(".ingredients-list .ingredient a");

  // Display/edit recipe preferences
  let defaultSearchIngredients = ["apple",
                                  "artichoke",
                                  "aubergine",
                                  "avocado",
                                  "bacon",
                                  "bean",
                                  "cheese",
                                  "carrot",
                                  "cherry",
                                  "chili",
                                  "chocolate",
                                  "chicken",
                                  "corn",
                                  "crab",
                                  "fish",
                                  "egg",
                                  "garlic",
                                  "honey",
                                  "ice-cream",
                                  "lemon",
                                  "lettuce",
                                  "melon",
                                  "mushroom",
                                  "mussel",
                                  "noodle",
                                  "olive",
                                  "pasta",
                                  "peach",
                                  "pepper",
                                  "pumpkin",
                                  "raspberry",
                                  "rice",
                                  "sausage",
                                  "steak",
                                  "strawberry",
                                  "tomato"
                                 ];
  let searchIngredients;
  // Get random number
  function rand(num) {
    return Math.floor(Math.random() * num);
  }

  // Return list of array items wrapped in a container
  function listAry(ary) {
    let list = "";
    ary.forEach(function(e){ list += ('<span class="' + e.toLowerCase() + '">' + e + '</span>') })
    return list
  }

  // Action!
  getRecipe();

  // ----------------------------------------------------------------------
  // Listeners
  //

  // Add listeners to recipe settings ingredients icons
  ingredientPref.forEach(function(item) {
    item.addEventListener("click", function() {
      // Grab the ingredient from the class name
      let ingredient = this.classList[0];
      // Toggle whether the ingredient appears as selected
      this.classList.toggle("selected");
      // Toggle ingredient in saved array
      searchIngredients.indexOf(ingredient) > -1 ? removeFromAry(ingredient, searchIngredients) : searchIngredients.push(ingredient);
      // Save to Chrome storage
      chrome.storage.sync.set({"recipeSettings": searchIngredients});
      // Test that the array is correct
      console.log(searchIngredients);
    });
  });

  // Listen for recipe reset
  recipeReload.addEventListener("click", function reload() {
    queryEdamam();
    chrome.storage.sync.get("recipe", (obj) => {
      recipes.recipePreview(obj.recipe)
    });
  });

  // ----------------------------------------------------------------------
  // Functions
  //

  (function getRecipePrefs() {
    // Get recipe settings from storage
    chrome.storage.sync.get("recipeSettings", function(obj){
      // Error handling
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("Check Chrome storage for 'recipeSettings': " + error);
      // If there are recipe settings in storage...
      } else if (obj.recipeSettings) {
        // For each ingredient in the display...
        displayRecipePrefs(obj.recipeSettings);
        // Add listeners and toggle array based on saved settings
        searchIngredients = obj.recipeSettings;
      } else {
        // Add listeners and toggle based on everything being selected
        searchIngredients = defaultSearchIngredients;
      }
    });
  })();

  function displayRecipePrefs(recipePrefs) {
    ingredientPref.forEach(function(a) {
      // Grab the class name...
      let ingredient = a.classList[0];
      // And toggle (remove) the "selected" class, if not in saved settings
      if (recipePrefs.indexOf(ingredient) === -1) {
        a.classList.toggle("selected");
      }
    })
  }


  (function getRecipe() {
    // Check storage for saved recipe
    chrome.storage.sync.get(null, function(obj){
      let recipe = obj.recipe;
      // Error handling
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("Check Chrome storage for saved recipe: " + error);
      // If there's nothing in storage,
      // OR the saved recipe is not today's date, run the query
      } else if (!obj.recipe || (obj.recipe.timestamp !== timestamp)) {
        queryEdamam();
      } else {
        recipes.recipePreview(obj.recipe);

      }
    });
  })();

  // Query Edamam API
  function queryEdamam() {

    // Define default recipe search options
    let dietOptions = ["balanced", "high-protein", "low-fat", "low-carb"]

    // Build query url
    // TODO - Delete the following line of code (and these comments) before deploying to Chrome Web Store
    // api prepends a proxy to get around CORS issue (only needed during development)
    const api = "https://cors-anywhere.herokuapp.com/" + "https://api.edamam.com/search";
    // TODO uncomment the next line
    // const api = "https://api.edamam.com/search";
    const app_id = "&app_id=" + config.edamamAppId;
    const app_key = "&app_key=" + config.edamamAppKey;
    let search = "?q=" + searchIngredients[rand(searchIngredients.length)];
    let diet1 = "&diet=" + dietOptions[rand(dietOptions.length)];
    let range = "&to=" + "100";
    const query = api + search + app_id + app_key + diet1 + range;

    // Query Edamam
    $.getJSON(query, function(json) {
      console.log(query);
      console.log(json);

      // Save query vars
      let randomRecipe = rand(json.hits.length);
      let servesNum = json.hits[randomRecipe].recipe.yield;
      let savedRecipe = {
        title: json.hits[randomRecipe].recipe.label,
        timestamp: timestamp,
        source: json.hits[randomRecipe].recipe.source,
        sourceUrl: json.hits[randomRecipe].recipe.url,
        calories: Math.round(json.hits[randomRecipe].recipe.calories/servesNum),
        diet: json.hits[randomRecipe].recipe.dietLabels,
        health: json.hits[randomRecipe].recipe.healthLabels,
        thumbnail: json.hits[randomRecipe].recipe.image,
        serves: servesNum,
        fat: Math.round(json.hits[randomRecipe].recipe.totalNutrients.FAT.quantity/servesNum),
        sugar: Math.round(json.hits[randomRecipe].recipe.totalNutrients.SUGAR.quantity/servesNum),
        carbs: Math.round(json.hits[randomRecipe].recipe.totalNutrients.CHOCDF.quantity/servesNum),
        protein: Math.round(json.hits[randomRecipe].recipe.totalNutrients.PROCNT.quantity/servesNum),
        notes: json.hits[randomRecipe].recipe.cautions
      };

      // Save to Chrome storage
      chrome.storage.sync.set({"recipe": savedRecipe});
    });
  }
  recipes.recipePreview = recipePreview;

  // Make display recipe function available to other scripts
  recipes.recipePreview = displayRecipe;

  // Display recipe preview with recipe data saved from API
  function displayRecipe(recipe) {
    recipeThumbnail.setAttribute("src", recipe.thumbnail);
    recipeTitle.textContent = recipe.title;
    recipeDietLabels.innerHTML = listAry(recipe.diet);
    //recipeHealthLabels.textContent = recipe.health;
    recipeCalories.textContent = recipe.calories;
    recipeServes.textContent = recipe.serves;
    recipeFat.textContent = recipe.fat;
    recipeSugar.textContent = recipe.sugar;
    recipeCarbs.textContent = recipe.carbs;
    recipeProtein.textContent = recipe.protein;
    recipeNotes.innerHTML = recipe.notes.length > 0 ? "Contains: " + listAry(recipe.notes) : "";
    recipeSource.innerHTML = recipe.source +
                               ' <i class="fa fa-angle-right" aria-hidden="true"></i>';
    recipeSource.setAttribute("href", recipe.sourceUrl);

  }
};
recipes();
// Recipes ends

