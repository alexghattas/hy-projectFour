// Create conditional statement when there is no match for beer
// Display a conditional statement when there is no match for serving suggestions
// Lower case and remove spaces from search input and value in array

var beerApp = {};

beerApp.lcboKey = 'MDo0NmY2MDY1MC1mZThmLTExZTYtOTE2OC1lNzNiZDhlNzg0NTg6QnNPeHBzcFdONGR1SXAzdG1vS3Q4WnhNR3BTY1pROGc4MGM3';

beerApp.init = function(){
    drinksWidg.events();
    beerApp.socialShare();
    drinksWidg.events();
    // beerApp.events();
}

// Gets the LCBO data 
beerApp.getBeerPieces = (query) => {
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
            reqUrl: 'http://lcboapi.com/products',
            params: {
                key: beerApp.lcboKey,
                q: query
            },
            xmlToJSON: false
        }
    })
    // Stores the data from the array into a variable
    .then(function(result) {
        var beerRes = result.result;
        beerApp.displayBeer(beerRes,query)
    });
}



// Gets the Recipe Puppy Data
beerApp.getFoodData = function(pairings) {
    $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
        reqUrl: 'http://www.recipepuppy.com/api/',
        params: {
            q: pairings
        },
        xmlToJSON: false
    }
}).then(function(res) {
    // Displays recipe results on to page
    let pairedRecipeTitle = res.results[0].title;
    let pairedRecipeLink = res.results[0].href;

    let recipeTitleEl = $('#beerRecipeTitle').text(pairedRecipeTitle);
    let recipeLinkEl = $('#beerRecipeLink').attr("href",pairedRecipeLink);
});
}





var drinksWidg = {};

drinksWidg.key = "MDphMmQxNzZiZS1mZDM5LTExZTYtYjQzZi02NzZjYTBlYTAxYTQ6NmZ2UXJsR0F1TDNFYW5QcVRIaDh2UDU5UWxzOWdEc1FZNEVD";

drinksWidg.input = drinksWidg.userInput;



$('#spirit').keyup(function(){
            var input = $('#spirit').val();

    $.ajax({
        url: 'http://lcboapi.com/products?access_key=ACCESS_KEY',
        type: 'GET',
        dataType: 'jsonp',
        headers: {
        Authorization: "token" + drinksWidg.key,
        },
            data: {
            per_page: 9,
            q: input
        },
        success: function(result) {

        var list = $('#autocomplete');

        list.empty();

        for(var i=0; i<result.result.length; i++){

        list.append('<option class="dropdown" value="' + result.result[i].name + '"></option>');
            }
        }
    });
});


// Runs the users search term through the LCBO API
drinksWidg.getLcbo = function(query){
    $("#results").html("");
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
            reqUrl: 'http://lcboapi.com/products',
            params: {
                key: drinksWidg.key,
                q: query
            },
            xmlToJSON: false
        }
    }).then(function(res) {
        var results = res.result[0];
            beerApp.displayBeerSearch(results)
    });
};


// Gets the users inputted value from the search form
drinksWidg.events = function() {
    $('.searchResults').hide();
    $("form").on("submit", function(e){
        e.preventDefault();
        var usersChoice = $("#spirit").val();
        $('.searchResults').show();
        drinksWidg.getLcbo(usersChoice);
    }); 
}


















// Searches the LCBO API with the users search input
// beerApp.displayBeer = (beerRes,query) => {
//     var beerChoice = beerRes.filter((beer) => {
//         return beer.name === query
//     })

//     beerApp.displayBeerSearch(beerChoice);
// }





beerApp.events = () => {
    $('.searchResults').hide();
    $('.errorEntry').hide();

    // listen to changes made on our select element
    $('#submitButton').on('click', (event) => {
        event.preventDefault();
        var usersChoice = $('#spirit').val();

        // beerApp.getBeerPieces(usersChoice);
        // $('.searchResults').show();

    })
}

// Displays beer information onto page
beerApp.displayBeerSearch = (beerChoice) => {
    // Resets the search results
    $('.beerImageLink').empty();
    // Creates variable for the users search term
    var beerResultsDisplay = beerChoice;

    let name = beerResultsDisplay.name;
    let image = beerResultsDisplay.image_url;
    let producer = beerResultsDisplay.producer_name;
    let pairings = beerResultsDisplay.serving_suggestion;
    let note = beerResultsDisplay.tasting_note;
    let origin = beerResultsDisplay.origin;
    let beerStyle = beerResultsDisplay.varietal;

    let nameEl = $('.beerTitle').text(name);
    let imageEl = $('<img>').attr('src', image);
    let imageAlt = $('.beerImage > img:not([alt])').attr('alt', name)
    let producerEl = $('#beerBrewery').text(producer);
    let pairingsEl = $('#beerPairing').text(pairings);
    let noteEl = $('#beerFact').text(note);
    let originEl = $('#beerLocation').text(origin);
    let beerStyleEl = $('#beerStyle').text(beerStyle);
    // Places the the above beer information to the page
    $('.beerImageLink').append(imageEl, imageAlt);
    // Calls the Recipe Puppy Food API
    beerApp.getFoodData(pairings);
}

beerApp.socialShare = () => {
    $("#share").jsSocials({
        shares: ["twitter", "facebook", "googleplus", "linkedin", "whatsapp"]
    });
}

// The document ready that runs the program
$(function(){
    beerApp.init();
});
