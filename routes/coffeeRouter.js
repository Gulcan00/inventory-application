const { Router } = require('express');
const coffeeController = require('../controllers/coffeeController');

const coffeeRouter = Router();

coffeeRouter.get('/:id/delete', coffeeController.deleteCoffee);
coffeeRouter.get('/:id', coffeeController.getCoffee);
coffeeRouter.get('/', coffeeController.getCoffees);

module.exports = coffeeRouter;
