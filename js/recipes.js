"use strict";




let url = "https://api.edamam.com/search?q=chicken&app_id=373a2755&app_key=5e414263cb40da6abf1019a550333f43";
$.getJSON(url, function(json) {
    var title = json.hits[0].recipe.label;
    console.log(title);
});


