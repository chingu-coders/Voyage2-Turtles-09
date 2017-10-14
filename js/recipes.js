    "use strict";



    $(function(){
        var url = "https://api.edamam.com/search?q=chicken&app_id=${“373a2755”}&app_key=${“5e414263cb40da6abf1019a550333f43”}";
        var quote = $("#quoteblock");// the id of the heading
        $.get(url, function (data) {
        var the_quote = data;
        console.log(the_quote);
        var author = $("#author");// id of author
        author.text(the_quote.contents.quotes[0].author);
        });
    });


