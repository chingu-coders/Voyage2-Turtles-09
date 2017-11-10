(function recipes() {
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

  // Set up user prefs
  // The following section is early implementation for allowing user prefs
  // in diet and allergies tags. However, the Edamam API is broken, so this
  // is in hiatus. The code is dormant, pining for lost loves...

  let dietVeggie = false;
  let dietVegan = false;
  let dietPaleo = false;
  let glutenAllergy = false;
  let dairyAllergy = false;
  let peanutAllergy = false;
  let shellfishAllergy = false;

  let recipeSettings = {
    vegetarian: dietVeggie === true ? "&health=vegetarian" : "",
    vegan: dietVegan === true ? "&health=vegan" : "",
    paleo: dietPaleo === true ? "&health=paleo" : "",
    gluten: glutenAllergy === true ? "&health=gluten-free" : "",
    dairy: dairyAllergy === true ? "&health=dairy-free" : "",
    peanuts: peanutAllergy === true ? "&health=peanut-free" : "",
    shellfish: shellfishAllergy === true ? "&health=shellfish-free" : ""
  }

  // Display/edit recipe preferences
  let defaultSearchIngredients = ["chicken", "beef", "bacon", "brussel"];
  let searchIngredients = [];
  getRecipePrefs();


  // ----------------------------------------------------------------------
  // Functions
  //

  function getRecipePrefs() {
    // Get recipe settings from storage
    chrome.storage.sync.get("recipeSettings", function(obj){
      let searchIngredients = obj.recipeSettings;
      // Error handling
      let error = chrome.runtime.lastError;
      if (error) {
        console.error("Check Chrome storage for 'recipeSettings': " + error);
      // If there are recipe settings in storage...
      } else if (obj.recipeSettings) {
        // For each ingredient in the display...
        ingredientPref.forEach(function(item) {
          // Grab the class name...
          let ingredient = item.classList[0];
          // And toggle (remove) the "selected" class, if not in saved settings
          if (searchIngredients.indexOf(ingredient) === -1) {
            item.classList.toggle("selected");
          }
        })
        // Add listeners and toggle array based on saved settings
        editRecipePrefs(searchIngredients);
        return searchIngredients;
      } else {
        // Add listeners and toggle based on everything being selected
        editRecipePrefs(defaultSearchIngredients);
        return searchIngredients = defaultSearchIngredients;
      }
    });
  };

  function editRecipePrefs(searchIngredients) {
    // When feature ingredient is clicked...
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
    })
  }

  function getRecipe(searchIngredients) {
    // Check storage for saved recipe
    chrome.storage.sync.get("recipe", function(obj){
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
  }

  // Query Edamam API
  function queryEdamam() {

    getRecipePrefs();

    // Define default recipe search options
    let searchTerms = searchIngredients;
    let dietOptions = ["balanced", "high-protein", "low-fat", "low-carb"]

    // Build query url
    // TODO - Delete the following line of code (and these comments) before deploying to Chrome Web Store
    // api prepends a proxy to get around CORS issue (only needed during development)
    const api = "https://cors-anywhere.herokuapp.com/" + "https://api.edamam.com/search";
    // TODO uncomment the next line
    // const api = "https://api.edamam.com/search";
    const app_id = "&app_id=" + "373a2755";
    const app_key = "&app_key=" + "5e414263cb40da6abf1019a550333f43";
    let search = "?q=" + searchTerms[rand(searchTerms.length)];
    let diet1 = "&diet=" + dietOptions[rand(dietOptions.length)];
    let diet2 = recipeSettings.vegetarian;
    let diet3 = recipeSettings.vegan;
    let diet4 = recipeSettings.paleo;
    let allergy1 = recipeSettings.gluten;
    let allergy2 = recipeSettings.dairy;
    let allergy3 = recipeSettings.peanuts;
    let allergy4 = recipeSettings.shellfish;
    let range = "&to=" + "100";
    const query = api + search + app_id + app_key + diet1 + diet2 + diet3 + diet4 +
                  allergy1 + allergy2 + allergy3 + allergy4 + range;

    // Query Edamam
    $.getJSON(query, function(json) {
      console.log(query);
      console.log(json);

      // Set data variables (edm == edamam)
      let randomRecipe = rand(json.hits.length);
      let edmTitle = json.hits[randomRecipe].recipe.label;
      let edmImage = json.hits[randomRecipe].recipe.image;
      let edmServes = json.hits[randomRecipe].recipe.yield;
      let edmCalories = Math.round(json.hits[randomRecipe].recipe.calories/edmServes);
      let edmSource = json.hits[randomRecipe].recipe.source;
      let edmSourceUrl = json.hits[randomRecipe].recipe.url;
      let edmDietLabels = json.hits[randomRecipe].recipe.dietLabels;
      let edmHealthLabels = json.hits[randomRecipe].recipe.healthLabels;
      let edmFat = Math.round(json.hits[randomRecipe].recipe.totalNutrients.FAT.quantity/edmServes);
      let edmSugar = Math.round(json.hits[randomRecipe].recipe.totalNutrients.SUGAR.quantity/edmServes);
      let edmCarbs = Math.round(json.hits[randomRecipe].recipe.totalNutrients.CHOCDF.quantity/edmServes);
      let edmProtein = Math.round(json.hits[randomRecipe].recipe.totalNutrients.PROCNT.quantity/edmServes);
      let edmNotes = json.hits[randomRecipe].recipe.cautions;

      // Save query vars
      let savedRecipe = {
        title: edmTitle,
        timestamp: timestamp,
        source: edmSource,
        sourceUrl: edmSourceUrl,
        calories: edmCalories,
        diet: edmDietLabels,
        health: edmHealthLabels,
        thumbnail: edmImage,
        serves: edmServes,
        fat: edmFat,
        sugar: edmSugar,
        carbs: edmCarbs,
        protein: edmProtein,
        notes: edmNotes
      }

      // Save to Chrome storage
      chrome.storage.sync.set({"recipe": savedRecipe});

      displayRecipe(savedRecipe);
    });
  }

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


  // Listen for recipe reset
  recipeReload.addEventListener("click", function reload() {
    queryEdamam();
  });

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

  // Remove an element from an array
  function removeFromAry(el, ary) {
    for (let i = ary.length-1; i >= 0; i--) {
      if (ary[i] === el) {
        ary.splice(i, 1);
      }
    }
  }

})();
// Recipes ends