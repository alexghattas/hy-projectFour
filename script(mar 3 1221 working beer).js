var beerApp = {};

beerApp.foodKey = 'af8752075b6e857d21b0e402c8de26b3';
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




beerApp.displayBeer = (beerRes,query) => {
    var beerChoice = beerRes.filter(function(beer){
        return beer.name === query
    })

    beerChoice[0].name = beerChoice[0].name.toLowerCase()
    beerApp.displayBeerSearch(beerChoice);
}





// Users searching for their beer
beerApp.events = (userSearch) => {

    // listen to changes made on our select element
    $('#submitButton').on('click', function(event){
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
    let price = beerResultsDisplay.price_in_cents / 100;

    let nameEl = $('<h2>').text(name);
    let imageEl = $('<img>').attr('src', image);
    let producerEl = $('<h3>').text(producer);
    let pairingsEl = $('<h5>').text(pairings);
    let priceEl = $('<h4>').text(price);

    let beerPiece = $('<div>').addClass('beers').append(nameEl, producerEl, pairingsEl, priceEl, imageEl)

    // Places the the above beer information to the page
    $('.searchResults').append(beerPiece);

}












// The document ready that runs the program
$(function(){
    beerApp.init();
});


// Get to display search results on page from LCBO api
    // 


// When you click on your beer, display an element with the beer info, image, etc.
// In the display, show a recipe from Food2Forl API
    // To get the recipe, scrape the "suggested servings" in the LCBO API for key terms
    // Cross reference those keyterms with the beer
















// // Gets the Food 2 Fork Data
// beerApp.getFoodData = function() {

//     $.ajax({
//     url: 'http://proxy.hackeryou.com',
//     dataType: 'json',
//     method:'GET',
//     data: {
//         reqUrl: 'http://food2fork.com/api/search',
//         params: {
//             key: beerApp.foodKey
//         },
//         xmlToJSON: false
//     }
// }).then(function(res) {
//     console.log('Food2Fork', res);
// });

// }
