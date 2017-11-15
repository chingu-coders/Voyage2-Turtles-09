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
  let initialSearchIngredients = ["avocado",
                                  "cheese",
                                  "chicken",
                                  "fish",
                                  "garlic",
                                  "lemon",
                                  "noodle",
                                  "berry",
                                  "beef",
                                  "tomato"];
  let allSearchIngredients = ["apple",
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
                              "shellfish",
                              "noodle",
                              "olive",
                              "pasta",
                              "peach",
                              "pepper",
                              "pumpkin",
                              "berry",
                              "rice",
                              "sausage",
                              "beef",
                              "strawberry",
                              "tomato"
                             ];
  let searchIngredients;


  // ----------------------------------------------------------------------
  // Helper Functions
  //

  // Remove an element from an array
  function removeFromAry(el, ary) {
    for (let i = ary.length-1; i >= 0; i--) {
      if (ary[i] === el) {
        ary.splice(i, 1);
      }
    }
  }

  // Get random number
  function rand(num) {
    return Math.floor(Math.random() * num);
  }

  // Return list of array items wrapped in a container
  function listAry(ary) {
    let list = "";
    ary.forEach(function(e){
      list += ('<span class="' + e.toLowerCase() + '">' + e + '</span>');
    });
    return list;
  }

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
    });
  });

  // Listen for recipe reload
  recipeReload.addEventListener("click", function reload() {
    queryEdamam();
  });

  // ----------------------------------------------------------------------
  // Recipe functions
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
        // For display saved recipe preferences
        displayRecipePrefs(obj.recipeSettings);
        // Define search preferences based on saved settings
        searchIngredients = obj.recipeSettings;
      } else {
        // Display "factory settings" preferences
        displayRecipePrefs(initialSearchIngredients);
        // Define search preferences based on initial settings
        searchIngredients = initialSearchIngredients;
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
    });
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
        displayRecipe(obj.recipe);
      }
    });
  })();

  // Query Edamam API
  function queryEdamam() {
    // Define recipe search options
    let dietOptions = ["balanced", "high-protein", "low-fat", "low-carb"];
    let ingredients = buildIngredientsQuery();

    // Build query url
    // TODO - Delete the following line of code (and these comments) before deploying to Chrome Web Store
    // api prepends a proxy to get around CORS issue (only needed during development)
    const api = "https://cors-anywhere.herokuapp.com/" + "https://api.edamam.com/search";
    // TODO uncomment the next line
    // const api = "https://api.edamam.com/search";
    const app_id = "&app_id=" + config.edamamAppId;
    const app_key = "&app_key=" + config.edamamAppKey;
    let search = "?q=" + ingredients[rand(ingredients.length)];
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
      // Display new recipe
      displayRecipe(savedRecipe);
    });
  }

  // Extrapolate exact search query from searchIngredients preferences
  function buildIngredientsQuery() {
    let ingredients = [];
    let fish = ["salmon", "tuna", "cod", "mackerel", "trout"];
    let mushroom = ["morel", "cremini", "portobello", "shiitake"];
    let cheese = ["brie", "burrata", "feta", "cheddar", "gouda", "camembert"];
    let shellfish = ["mussel", "oyster", "crawfish", "lobster", "prawn", "shrimp"];
    let melon = ["watermelon", "rock melon", "cantaloupe"];
    let bacon = ["pork", "ham", "pork belly", "pork ribs"];
    let beef = ["steak", "brisket", "ragu", "stroganoff", "bourguignon"];
    let berry = ["raspberry", "blueberry", "blackberry", "cranberry"];
    let lettuce = ["arugula", "endive", "romaine", "cress"];
    let pasta = ["spaghetti", "macaroni", "fettuccine", "linguine",
                  "penne", "tagliatelle", "ravioli", "orzo"];
    let keyIngredients = [fish, mushroom, cheese, shellfish,
                              melon, bacon, beef, berry, lettuce, pasta];
    let keyIngredientsStrings = ["fish", "mushroom", "cheese", "shellfish",
                              "melon", "bacon", "beef", "berry", "lettuce", "pasta"];

    // If the user deselects ALL of the ingredients in recipe settings...
    if (searchIngredients.length < 1) {
      // Push all ingredients to search array, for random recipe
      allSearchIngredients.forEach(function(el){
        ingredients.push(el);
      });
    } else {
      // If the user has set ingredients preferences, push those to search array
      searchIngredients.forEach(function(el){
        ingredients.push(el);
      });
    }

    // Add sub-ingredients, if high level ingredients are found
    // Iterate through key ingredients array
    for (let i = 0; i < keyIngredients.length; i++) {
      let key = keyIngredientsStrings[i];
      // If a key ingredient is found in the ingredients array...
      if (ingredients.indexOf(key) > -1) {
        for (let j = 0; j < keyIngredients[i].length; j++) {
          // Push the related sub-ingredients into the search array
          ingredients.push(keyIngredients[i][j]);
        }
      }
    }

    return ingredients;
  }

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
}
recipes();
// Recipes ends

