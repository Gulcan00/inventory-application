const { Router } = require('express');
const coffeeController = require('../controllers/coffeeController');

const coffeeRouter = Router();

coffeeRouter.get('/', coffeeController.getCoffees);
coffeeRouter.get('/:id', coffeeController.getCoffee);

module.exports = coffeeRouter;
