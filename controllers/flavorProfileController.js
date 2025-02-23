const { param, body, validationResult } = require('express-validator');
const db = require('../db/queries');
const tableName = 'flavor_profiles';

const getFlavorProfiles = [
  async (req, res) => {
    const columns = ['name'];
    const items = await db.getRecords(tableName);

    res.render('items-list', {
      columns,
      rows: items,
      path: 'flavor-profile',
    });
  },
];

const getFlavorProfile = [
  param('id').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).render('error', {
        error: 'Invalid id for flavor profile',
      });
    }

    const id = req.params.id;
    const flavorProfile = await db.getRecord(tableName, id);

    if (!flavorProfile) {
      res.status(404).render('error', {
        error: `Flavor profile with id ${id} does not exist`,
      });
    }

    res.render('detail', {
      title: flavorProfile.name,
      path: 'flavor-profile',
      item: flavorProfile,
    });
  },
];

const validateFlavorProfile = body('name')
  .trim()
  .isAlpha('en-US', { ignore: ' ' })
  .withMessage('Name must only contain letters.');

const createFlavorProfilePOST = [
  validateFlavorProfile,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMsg = errors[0].msg;
      return res.status(400).render('./forms/form', {
        path: 'flavor-profile',
        error: errorMsg,
        data: {},
      });
    }

    const { name } = req.body;
    await db.createRecord(tableName, name);
    res.redirect('/flavor-profile');
  },
];

async function createFlavorProfileGET(req, res) {
  const id = req.params.id;

  if (id) {
    const flavorProfile = await db.getRecord(tableName, id);
    res.render('./forms/form', {
      path: 'flavor-profile',
      data: flavorProfile,
    });
  } else {
    res.render('./forms/form', {
      path: 'flavor-profile',
      data: {},
    });
  }
}

const updateFlavorProfile = [
  validateFlavorProfile,
  async (req, res) => {
    const id = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const flavorProfile = await db.getRecord(tableName, id);
      const errorMsg = errors[0].msg;
      return res.status(400).render('./forms/form', {
        path: 'flavor-profile',
        error: errorMsg,
        data: flavorProfile,
      });
    }

    const { name } = req.body;
    await db.updateRecord(tableName, { id, name });
    res.redirect('/flavor-profile');
  },
];

const deleteFlavorProfile = [
  param('id').isNumeric(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('error', {
        error: 'Invalid id for flavor profile',
      });
    }

    const id = req.params.id;
    if (await db.checkFlavorProfileIsInUse(id)) {
      res.status(405).render('error', {
        error: 'Flavor profile is used by coffees',
      });
    } else {
      next();
    }
  },
  async (req, res) => {
    const id = req.params.id;
    await db.deleteRecord(tableName, id);
    res.redirect('/flavor-profile');
  },
];

module.exports = {
  getFlavorProfiles,
  getFlavorProfile,
  createFlavorProfilePOST,
  createFlavorProfileGET,
  updateFlavorProfile,
  deleteFlavorProfile,
};
