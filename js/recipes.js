(function recipes() {
  "use strict";

  // Set up DOM variables
  const recipeThumbnail = document.querySelector(".recipe-thumbnail");
  const recipeTitle = document.querySelector(".recipe-title");
  const recipeCalories = document.querySelector(".recipe-calories .value");
  const recipeDailyValue = document.querySelector(".recipe-daily-value .value");
  const recipeSource = document.querySelector(".recipe-source");

  // Build API URL
  const api = "https://api.edamam.com/search?q=";
  let search = "chicken";
  const app_id = "&app_id=373a2755";
  const app_key = "&app_key=5e414263cb40da6abf1019a550333f43";
  let options = "";
  const url = api + search + app_id + app_key + options;

  // Query Edamam API
  $.getJSON(url, function(json) {
    // Set random pick from data array
    let randomRecipe = Math.round(Math.random() * 10);

    // Set data variables
    let title = json.hits[randomRecipe].recipe.label;
    let image = json.hits[randomRecipe].recipe.image;
    let calories = Math.round(json.hits[randomRecipe].recipe.calories);
    // let dailyValue = json.hits[randomRecipe].recipe.totalDaily;
    let source = json.hits[randomRecipe].recipe.source;
    let sourceUrl = json.hits[randomRecipe].recipe.url;

    // Populate DOM with recipe data
    console.log(json);
    recipeThumbnail.setAttribute("src", image);
    recipeTitle.textContent = title;
    recipeCalories.textContent = calories;
    // recipeDailyValue.textContent = ;
    recipeSource.textContent = source;
    recipeSource.setAttribute("href", sourceUrl);

  });


})();
// Recipes ends