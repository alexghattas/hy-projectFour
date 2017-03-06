var beerApp = {};

beerApp.lcboKey = 'MDo0NmY2MDY1MC1mZThmLTExZTYtOTE2OC1lNzNiZDhlNzg0NTg6QnNPeHBzcFdONGR1SXAzdG1vS3Q4WnhNR3BTY1pROGc4MGM3';

beerApp.init = function(){
    beerApp.events();
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
    let pairedRecipeTitle = res.results[0].title;
    let pairedRecipeLink = res.results[0].href;

    let recipeTitleEl = $('<h5>').text(pairedRecipeTitle);
    let recipeLinkEl = $('<h5>').text(pairedRecipeLink);

    $('.searchResults').append(recipeTitleEl, recipeLinkEl);
});
}

// Searches the LCBO API for user search input
beerApp.displayBeer = (beerRes,query) => {
    var beerChoice = beerRes.filter((beer) => {
        return beer.name === query
    })

    beerChoice[0].name = beerChoice[0].name.toLowerCase()
    beerApp.displayBeerSearch(beerChoice);
}

// Users searching for their beer
beerApp.events = (userSearch) => {

    // listen to changes made on our select element
    $('#submitButton').on('click', (event) => {
        event.preventDefault();

        // get value of the users search
        var usersChoice = $('#searchTerm').val();
        beerApp.getBeerPieces(usersChoice);
    })
}

// Displays beer information onto page
beerApp.displayBeerSearch = (beerChoice) => {
    // Resets the search results
    $('.searchResults').empty();

    // Creates variable for the users search term
    var beerResultsDisplay = beerChoice[0];

    let name = beerResultsDisplay.name;
    let image = beerResultsDisplay.image_url;
    let producer = beerResultsDisplay.producer_name;
    let pairings = beerResultsDisplay.serving_suggestion;
    let note = beerResultsDisplay.tasting_note;
    let origin = beerResultsDisplay.origin;
    let beerStyle = beerResultsDisplay.varietal;

    let nameEl = $('<h2>').text(name);
    let imageEl = $('<img>').attr('src', image);
    let producerEl = $('<h3>').text(producer);
    let pairingsEl = $('<h5>').text(pairings);
    let noteEl = $('<h5>').text(note);
    let originEl = $('<h5>').text(origin);
    let beerStyleEl = $('<h5>').text(beerStyle);

    let beerPiece = $('<div>').addClass('beers').append(nameEl, producerEl, pairingsEl, noteEl, originEl, beerStyleEl, imageEl)

    // Places the the above beer information to the page
    $('.searchResults').append(beerPiece);

    // Calls the Recipe Puppy Food API
    beerApp.getFoodData(pairings);

}

// The document ready that runs the program
$(function(){
    beerApp.init();
});
