const functions = require("firebase-functions");
const app = require('express')();
var cors = require('cors')

app.use(cors())

const { 
    chatgptAPI
} = require('./APIs/apis')

app.get('/', (req, res) => {
    res.send('Hello World! This is Studily!')
});
 
app.post('/chatgpt_api', chatgptAPI);

exports.api = functions.https.onRequest(app);