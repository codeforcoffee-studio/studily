const functions = require("firebase-functions");
const app = require('express')();
var cors = require('cors')

app.use(cors())

const { 
    getExample
} = require('./APIs/apis')

app.get('/', (req, res) => {
    res.send('Hello World! This is Studily!')
});
 
app.get('/example', getExample);

exports.api = functions.https.onRequest(app);
