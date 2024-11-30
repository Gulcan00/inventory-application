const { Router } = require('express');
const coffeeController = require('../contollers/coffeeController');

const coffeeRouter = Router();

coffeeRouter.get('/', coffeeController.getCoffees);

module.exports = coffeeRouter;
