(function recipes() {
  "use strict";

  // Build URL
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
    let calories = json.hits[randomRecipe].recipe.calories;
    let source = json.hits[randomRecipe].recipe.source;

    console.log(json);
    console.log(title);
    console.log(calories);
    console.log(source);
  });


})();
// Recipes ends