const express = require('express');
const app = express();
const cors = require('cors');
const geohash = require('ngeohash');

var SpotifyWebApi = require('spotify-web-api-node');
const port = process.env.PORT || 8080;
const path = require('path');


app.use(cors());
app.use(express.static(path.join(__dirname, "/dist/event-search")));

app.get('/autocomplete/:keyword', function (req, res) {
  var url = 'https://app.ticketmaster.com/discovery/v2/suggest?apikey=';

  var keyword = req.params.keyword

  fetch(url + my_token + "&keyword=" + keyword)
    .then(response => response.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => { console.log(err) });
})

app.get('/searchEvents', function (req, res) {
  var url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=';


  const keyword = req.query.keyword;
  var urlKeyword = keyword.replace(/\s+/g, '+');
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const category = req.query.category;
  const distance = req.query.distance;

  var music_id = "KZFzniwnSyZfZ7v7nJ";
  var sport_id = "KZFzniwnSyZfZ7v7nE";
  var art_id = "KZFzniwnSyZfZ7v7na";
  var film_id = "KZFzniwnSyZfZ7v7nn";
  var miscellaneous_id = "KZFzniwnSyZfZ7v7n1";
  var segmentId = "";
  
  var artistId = "";

  if (category == "Music") {
    segmentId = music_id;
  }
  else if (category == "Sports") {
    segmentId = sport_id;
  }
  else if (category == "Art & Theatre") {
    segmentId = art_id;
  }
  else if (category == "Film") {
    segmentId = film_id;
  }
  else if (category == "Default") {
    segmentId = "";
  }
  else {
    segmentId = miscellaneous_id;
  }
  const encoded = geohash.encode(latitude, longitude);
  fetch(url + my_token + "&keyword=" + urlKeyword + "&segmentId=" + segmentId + "&radius=" + distance + "&unit=miles&geoPoint=" + encoded)
    .then(response => response.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => { console.log(err) });
})

app.get('/getDetails', function (req, res) {
  var url = "https://app.ticketmaster.com/discovery/v2/events/";
  fetch(url + req.query.eventId + "?apikey=" + my_token)
    .then(response => response.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => { console.log(err) });
})

app.get('/getVenues', function (req, res) {
  var url = "https://app.ticketmaster.com/discovery/v2/venues?apikey=";
  // console.log(req.query.venueName)
  fetch(url + my_token + "&keyword=" + req.query.venueName)
    .then(response => response.json())
    .then(data => {
      // res.send(data)
      res.send(data._embedded.venues[0]);
    })
    .catch(err => { console.log(err) });
})

app.get('/spotify', function (req, res) {
  const spotifyApi = new SpotifyWebApi({
    clientId: "9222f88838c449f3a0da4f30661872b4",
    clientSecret: "1e8cd0ed78624b9e96e669557c223eda"
  });

  // Retrieve an access token
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      // console.log('The access token expires in ' + data.body['expires_in']);
      // console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token'])
      spotifyApi.searchArtists(req.query.artistName).then(
        function (data) {
          res.send(data);
          console.log(data);

        },
        function (err) {
          console.error(err);
        }
      );
    },
    function (err) {
      console.log(
        'Something went wrong when retrieving an access token',
        err.message
      );
    })
})


app.get('/spotifyAlbum', function (req, res) {
  const spotifyApi = new SpotifyWebApi({
    clientId: "9222f88838c449f3a0da4f30661872b4",
    clientSecret: "1e8cd0ed78624b9e96e669557c223eda"
  });

  // Retrieve an access token
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      // console.log('The access token expires in ' + data.body['expires_in']);
      // console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
      console.log(req.query.artistId);
      spotifyApi.getArtistAlbums(req.query.artistId, {limit: 3},
        function(err, data) {
          if (err) {
            console.error('Something went wrong!');
            console.log(err);
            console.log(data);
          } else {
            res.send(data.body);
          }
        }
      );
    },
    function (err) {
      console.log(
        'Something went wrong when retrieving an access token',
        err.message
      );
    })
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/event-search/index.html"));
});

app.get("/favorites", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/event-search/index.html"));
});

app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/event-search/index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
