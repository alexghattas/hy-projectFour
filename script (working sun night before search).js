var beerApp = {};

beerApp.lcboKey = 'MDo0NmY2MDY1MC1mZThmLTExZTYtOTE2OC1lNzNiZDhlNzg0NTg6QnNPeHBzcFdONGR1SXAzdG1vS3Q4WnhNR3BTY1pROGc4MGM3';

beerApp.init = function(){
    beerApp.animatedTyping();
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

// Searches the LCBO API with the users search input
beerApp.displayBeer = (beerRes,query) => {
    var beerChoice = beerRes.filter((beer) => {
        return beer.name === query
    })

    beerApp.displayBeerSearch(beerChoice);
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
    $('.beerImage').empty();
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
    $('.beerImage').append(imageEl, imageAlt);
    // Calls the Recipe Puppy Food API
    beerApp.getFoodData(pairings);
}

beerApp.socialShare = () => {
    $("#share").jsSocials({
        shares: ["twitter", "facebook", "googleplus", "linkedin", "whatsapp"]
    });
}

// Animated typing 
beerApp.animatedTyping = () => {   
     consoleText(['Type in a beer below...', 'and we will give you a recipe!'], 'text');

    function consoleText(words, id, colors) {
      if (colors === undefined) colors = ['$secondaryColor'];
      var visible = true;
      var con = document.getElementById('console');
      var letterCount = 1;
      var x = 1;
      var waiting = false;
      var target = document.getElementById(id)
      target.setAttribute('style', 'color:' + colors[0])
      window.setInterval(function() {

        if (letterCount === 0 && waiting === false) {
          waiting = true;
          target.innerHTML = words[0].substring(0, letterCount)
          window.setTimeout(function() {
            var usedColor = colors.shift();
            colors.push(usedColor);
            var usedWord = words.shift();
            words.push(usedWord);
            x = 1;
            target.setAttribute('style', 'color:' + colors[0])
            letterCount += x;
            waiting = false;
          }, 1000)
        } else if (letterCount === words[0].length + 1 && waiting === false) {
          waiting = true;
          window.setTimeout(function() {
            x = -1;
            letterCount += x;
            waiting = false;
          }, 1000)
        } else if (waiting === false) {
          target.innerHTML = words[0].substring(0, letterCount)
          letterCount += x;
        }
      }, 90)
      window.setInterval(function() {
        if (visible === true) {
          con.className = 'console-underscore hidden'
          visible = false;

        } else {
          con.className = 'console-underscore'

          visible = true;
        }
      }, 400)
    }
}

// The document ready that runs the program
$(function(){
    beerApp.init();
});
