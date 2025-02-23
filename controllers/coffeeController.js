const { param, body, validationResult } = require('express-validator');
const db = require('../db/queries');
const tableName = 'coffees';

async function getCoffees(req, res) {
  const columns = ['name', 'description', 'roast_level', 'price', 'quantity'];
  const items = await db.getRecords(tableName);

  res.render('items-list', {
    columns,
    rows: items,
    path: 'coffee',
  });
}

const getCoffee = [
  param('id').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).render('error', {
        error: 'Invalid id for coffee',
      });
    }

    const id = req.params.id;
    const coffee = await db.getRecord(tableName, id);

    if (!coffee) {
      res.status(404).render('error', {
        error: `Coffee with id ${id} does not exist`,
      });
    }

    coffee.roastLevel = coffee.roast_level;
    const region = await db.getRecord('regions', coffee.region_id);
    coffee.region = region.name;
    coffee.flavorProfiles = await db.getCoffeeFlavorProfiles(id);

    res.render('detail', {
      title: coffee.name,
      path: 'coffee',
      item: coffee,
    });
  },
];

async function deleteCoffee(req, res) {
  const id = req.params.id;
  await db.deleteCoffee(id);
  res.redirect('/');
}

const alphaErr = 'must only contain letters.';
const validateCoffee = [
  body('name')
    .trim()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage(`Name ${alphaErr}`),
  body('description')
    .optional({ values: 'falsy' })
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage(`Description ${alphaErr}`),
  body('price')
    .isCurrency({ allow_negatives: false })
    .withMessage('Invalid currency'),
  body('quantity')
    .isLength({ min: 0 })
    .withMessage('Quantity cannot be negative'),
  body('flavorProfileIds').toArray(),
];

const createCoffeePOST = [
  validateCoffee,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const regions = await db.getRecords('regions');
      const flavorProfiles = await db.getRecords('flavor_profiles');
      const errorMessages = errors.array().reduce((obj, err) => {
        const name = err.path;
        obj[name] = err.msg;
        return obj;
      }, {});

      return res.status(400).render('./forms/coffee-form', {
        regions,
        flavorProfiles,
        errors: errorMessages,
        coffee: {},
      });
    }

    const data = req.body;
    await db.createCoffee(data);
    res.redirect('/');
  },
];

async function createCoffeeGET(req, res) {
  const id = req.params.id;
  const regions = await db.getRecords('regions');
  const flavorProfiles = await db.getRecords('flavor_profiles');

  if (id) {
    const coffee = await db.getRecord(tableName, id);
    coffee.flavor_profiles = await db.getCoffeeFlavorProfiles(id);
    res.render('./forms/coffee-form', {
      regions,
      flavorProfiles,
      coffee,
    });
  } else {
    res.render('./forms/coffee-form', {
      regions,
      flavorProfiles,
      coffee: {},
    });
  }
}

const updateCoffee = [
  validateCoffee,
  async (req, res) => {
    const id = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const coffee = await db.getRecord(tableName, id);
      coffee.flavor_profiles = await db.getCoffeeFlavorProfiles(id);
      const regions = await db.getRecords('regions');
      const flavorProfiles = await db.getRecords('flavor_profiles');
      const errorMessages = errors.array().reduce((obj, err) => {
        const name = err.path;
        obj[name] = err.msg;
        return obj;
      }, {});

      return res.status(400).render('./forms/coffee-form', {
        regions,
        flavorProfiles,
        errors: errorMessages,
        coffee,
      });
    }

    const data = req.body;

    await db.updateCoffee(id, data);
    res.redirect('/');
  },
];

module.exports = {
  getCoffees,
  getCoffee,
  deleteCoffee,
  createCoffeePOST,
  createCoffeeGET,
  updateCoffee,
};
