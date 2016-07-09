var keys = require('./keys.js');
var inquirer = require('inquirer'); //package used to prompt questions and capture answers.
var fs = require('fs'); //all things the api can do.
var userInput = process.argv[2];
var secondInput = process.argv[3];

inquirer.prompt([{
  type: "list",
  message: "Choose from the following options.",
  choices: ["my-tweets", "spotify-this-song", "movie"],
  chosen: "action"
}]).then(function(answers) {

  switch (answers.chose) {
    case 'Twitter':
      tweeterSearch();
      break;
    case 'Music':
      spotifySearch();
      break;
    case 'Movies':
      movieSearch();
      break;
    case "do-what-it-says":
      doSearch();
      break;
  }
});

function tweeterSearch() {
  var Twitter = require('twitter');
  var client = new Twitter(keys.twitterKeys);

  var params = {
    screen_name: 'level9twenty'
  };

  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < 20; i++) {
        console.log("Tweet: " + tweets[i].created_at + "\n" + "Tweet Number: " + (i + 1) + "\n" + tweets[i].text + "\n");
      }
    }
    else {
      console.log("error");
    }
  });
}

function spotifySearch() {
  var spotify = require('spotify');
  //var spotArr = [];

  inquirer.prompt([{
    type: "input",
    message: "What song name would you like to search?",
    name: "song"
  }]).then(function(answers) {
    spotify.search({
      type: 'track',
      query: answers.song,
    }, function(err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song: " + data.tracks.items[0].name);
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log("Preview Here: " + data.tracks.items[0].preview_url);
    });
  });
}

function movieSearch() {
  inquirer.prompt([{
    type: "input",
    message: "What movie would you like to search?",
    name: "movie"
  }]).then(function(answers) {
    var request = require('request');
    var movie = answers.movie;

    if (movie === undefined) {
      movie = "Mr. Nobody";
    }
    else {
      var url = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=long&tomatoes=true&r=json';
      request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("Title: " + JSON.parse(body)["Title"]);
          console.log("Year: " + JSON.parse(body)["Year"]);
          console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
          console.log("Country: " + JSON.parse(body)["Country"]);
          console.log("Language: " + JSON.parse(body)["Language"]);
          console.log("Plot: " + JSON.parse(body)["Plot"]);
          console.log("Actors: " + JSON.parse(body)["Actors"]);
          console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
          console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
        }
      });
    };
  });
}

function doSearch() {
  fs.readFile("random.txt", "utf8", function(error, data) {

    var textData = data.split(",");

    userInput = textData[0];

    secondInput = textData[1];
  });
}