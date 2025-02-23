const { Router } = require('express');
const regionController = require('../controllers/regionController');

const regionRouter = Router();

regionRouter.get('/', regionController.getRegions);
regionRouter.get('/create', regionController.createRegionGET);
regionRouter.post('/create', regionController.createRegionPOST);
regionRouter.get('/:id', regionController.getRegion);
regionRouter.post('/:id/delete', regionController.deleteRegion);
regionRouter.get('/:id/edit', regionController.createRegionGET);
regionRouter.post('/:id/edit', regionController.updateRegion);

module.exports = regionRouter;
