const { Router } = require('express');
const coffeeController = require('../controllers/coffeeController');

const coffeeRouter = Router();

coffeeRouter.get('/', coffeeController.getCoffees);
coffeeRouter.post('/create', coffeeController.createCoffeePOST);
coffeeRouter.get('/create', coffeeController.createCoffeeGET);
coffeeRouter.get('/:id', coffeeController.getCoffee);
coffeeRouter.get('/:id/delete', coffeeController.deleteCoffee);

module.exports = coffeeRouter;
