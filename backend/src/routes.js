const express = require('express');
const { route } = require('./app');
const baseService = require('./services/baseService');

const routes = express.Router();

routes.get('/values', async (req, res) => {
    // startDate format is yyyy-mm-dd
    const { state, startDate, endDate, productType } = req.query;
    const query = {
        ...(state && { state }),
        ...((startDate && endDate) && { startDate, endDate }),
        ...(productType && { productType })
    };

    try {
        const results = await baseService.list(query);
        return res.json(results);
    } catch (err) {
        return res.status(422).json({ status: 'Error', message: err.message });
    }
});

routes.get('/aggregate', (req, res) => {

});

module.exports = routes;
