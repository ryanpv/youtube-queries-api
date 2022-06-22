const { google } = require('googleapis');
const express = require('express');
const axios = require('axios');
const app = express();
const { apiKey } = require('../apiKey')
require('dotenv/config');
const baseApiUrl = "https://www.googleapis.com/youtube/v3";
const youtubeApi = google.youtube({
    version: 'v3',
    auth: apiKey
});
const { OAuth2Client } = require('google-auth-library');

// google.youtube('v3').search.list({
//     key: process.env.YOUTUBE_TOKEN,
//     part: 'snippet',
//     q: 'deez nutz',
//     maxResults: 5
// }).then((response) => {
//     const { data } = response;
//     data.items.forEach((item) => {
//         console.log(`Title: ${item.snippet.title}\nDescription:${item.snippet.description}\n`);
//     })
// }).catch((err) => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello from our API')
})

app.get('/search', async (req, res) => {
    try{
        const searchQuery = req.query.search_query
        const url = `${ baseApiUrl }/search?key=${ apiKey }&type=video&part=snippet&maxResults=3&q=${ searchQuery }`
        const response = await axios.get(url)
        const titles = response.data.items.map(item => item.snippet.title);
        res.send(titles);

    } 
    catch(err) { console.log(err)}
})

// -------------PLAYLIST QUERIES--------------------
app.get('/playlist/:pListParams', async (req, res) => {
    try{
        const pListParams = req.params.pListParams
        const url = `${ baseApiUrl }/playlistItems?key=${ apiKey }&part=snippet%2C%20contentDetails&maxResults=1&playlistId=${ pListParams }`
        const response = await axios.get(url);
        const titleId = response.data.items.map(id => id.snippet.resourceId)
        // const numId = titleId.id
        const pListTitles = response.data.items.map(pItem => pItem.snippet.title)
        res.send({pListTitles, titleId})

    } 
    catch(err) { console.log(err)}
})

// -------------LIKED VIDEOS-------------------
app.get('/likedvideos', async (req, res) => {
    try{
        // const videoTopic = req.params.videoTopic
        const url = `${ baseApiUrl }/videos?key=${ apiKey}&part=snippet%2CcontentDetails%2Cstatistics&maxResults=3&myRating=like`
        
        function authenticate() {
            return gapi.auth2.getAuthInstance()
            .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
            .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
        }
        function loadClient() {
            gapi.client.setApiKey(apiKey);
            return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
            .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
        }
        authenticate();
        loadClient();
        
        const response = await axios.get(url);
        const likedTitles = response.data.items.map(likedVideos => likedVideos.snippet.title)
        
        res.send({ likedTitles })

    }
    catch(err) { console.log(err) };
});



// var areEqual = string1.toUpperCase() === string2.toUpperCase();


const port = process.env.PORT || 8989;

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});