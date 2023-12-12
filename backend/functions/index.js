const functions = require("firebase-functions");
const app = require('express')();
var cors = require('cors')

app.use(cors())

const { 
    chatgptAPI,
    wikiAPI,
    youtubeAPI
} = require('./APIs/apis')

app.get('/', (req, res) => {
    res.send('Hello World! This is Studily!')
});
 
app.post('/chatgpt_api', chatgptAPI);
app.post('/wiki_api', wikiAPI);
app.post('/youtube_api', youtubeAPI);

exports.api = functions.https.onRequest(app);