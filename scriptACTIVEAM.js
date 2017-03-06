// Create conditional statement when there is no match for beer
// Display a conditional statement when there is no match for serving suggestions
// Lower case and remove spaces from search input and value in array

var beerApp = {};

beerApp.lcboKey = 'MDo0NmY2MDY1MC1mZThmLTExZTYtOTE2OC1lNzNiZDhlNzg0NTg6QnNPeHBzcFdONGR1SXAzdG1vS3Q4WnhNR3BTY1pROGc4MGM3';

beerApp.init = function(){
    beerApp.socialShare();
    beerApp.events();
}

// Gets the LCBO data 
beerApp.getBeerPieces = (query) => {
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
            reqUrl: 'https://lcboapi.com/products',
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

// Searches the LCBO API with the users search input
beerApp.displayBeer = (beerRes,query) => {
    var beerChoice = beerRes.filter((beer) => {
        return beer.name === query
    })
    beerApp.displayBeerSearch(beerChoice);
    console.log(beerChoice)
}

// Users input that is typed into search box
beerApp.events = (userSearch) => {
    $('.searchResults').hide();

    // listen to changes made on our select element
    $('#submitButton').on('click', (event) => {
        event.preventDefault();
        // get value of the users search
        var usersChoice = $('#searchTerm').val();
        beerApp.getBeerPieces(usersChoice);

        $('.searchResults').show();
    })
}

// Displays beer information onto page
beerApp.displayBeerSearch = (beerChoice) => {
    // Resets the search results
    $('.beerImageLink').empty();
    // Creates variable for the users search term
    var beerResultsDisplay = beerChoice[0];

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
