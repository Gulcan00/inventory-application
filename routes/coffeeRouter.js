const { Router } = require('express');
const coffeeController = require('../controllers/coffeeController');

const coffeeRouter = Router();

coffeeRouter.get('/', coffeeController.getCoffees);
coffeeRouter.post('/create', coffeeController.createCoffeePOST);
coffeeRouter.get('/create', coffeeController.createCoffeeGET);
coffeeRouter.get('/:id', coffeeController.getCoffee);
coffeeRouter.post('/:id/delete', coffeeController.deleteCoffee);
coffeeRouter.get('/:id/edit', coffeeController.createCoffeeGET);
coffeeRouter.post('/:id/edit', coffeeController.updateCoffee);

module.exports = coffeeRouter;
