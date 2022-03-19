require("dotenv").config()

const express = require("express")
const hbs = require("hbs")

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node")

const app = express()

app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/public"))

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  )

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index")
})

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body)

      res.render("artist-search-results", { artists: data.body.artists.items })
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    )
})

app.get("/albums/:artistId", (req, res) => {
  let artistId = req.params.artistId
  spotifyApi.getArtistAlbums(artistId, { limit: 10, offset: 20 }).then(
    function (data) {
      console.log("Artist albums", data.body)
      res.render("albums", { albums: data.body.items })
    },
    function (err) {
      console.error(err)
    }
  )
})

app.get("/tracks/:albumId", (req, res) => {
  let albumId = req.params.albumId
  spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 }).then(
    function (data) {
      console.log(data.body)
    },
    function (err) {
      console.log("Something went wrong!", err)
    }
  )
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
)
