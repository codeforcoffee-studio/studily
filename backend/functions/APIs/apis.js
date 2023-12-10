const { admin, db } = require('../util/admin');
const { firebaseConfig } = require('../util/config');
const { initializeApp } = require('firebase/app');

initializeApp(firebaseConfig);

// GET /task
exports.getExample =  async (req, res) => {
    res.send("example api");
}
