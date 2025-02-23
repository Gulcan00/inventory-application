const { Router } = require('express');
const flavorProfileController = require('../controllers/flavorProfileController');

const flavorProfileRouter = Router();

flavorProfileRouter.get('/', flavorProfileController.getFlavorProfiles);
flavorProfileRouter.get(
  '/create',
  flavorProfileController.createFlavorProfileGET
);
flavorProfileRouter.post(
  '/create',
  flavorProfileController.createFlavorProfilePOST
);
flavorProfileRouter.get('/:id', flavorProfileController.getFlavorProfile);
flavorProfileRouter.post(
  '/:id/delete',
  flavorProfileController.deleteFlavorProfile
);
flavorProfileRouter.get(
  '/:id/edit',
  flavorProfileController.createFlavorProfileGET
);
flavorProfileRouter.post(
  '/:id/edit',
  flavorProfileController.updateFlavorProfile
);

module.exports = flavorProfileRouter;
