require('dotenv').config()

const express = require("express");
const app = module.exports = express();

const { PORT } = require('./config')
const mongo = require('./mongo');

(async () => {

    try {
        await mongo.connect();
    } catch (error) {
        console.error('Failed to connect to mongo:', error);
        process.exit()
    }

    app.use('/api', require('./api'));

    app.listen(PORT, function () {
        console.log(`App listening on port ${PORT}!`);
    });
})();


