const express = require('express');
const { dbConnection } = require('./db/connection');

const app = express();
app.use(express.json());


app.get('/', async function (req, res) {
    return res.json({
        message: 'funfou'
    })
})

module.exports = app;