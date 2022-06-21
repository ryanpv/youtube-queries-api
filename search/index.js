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

const path = require('path')

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
console.log(require("dotenv").config())


const port = process.env.PORT || 8989;

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});