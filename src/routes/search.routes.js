const express = require('express');
const searchItem = require('../infrastructure/repositories/search-product');
const routes = express.Router();

routes.post('/api/search', async (request, response) => {
  await searchItem(request, response);
});


module.exports = routes;