const { body, validationResult } = require('express-validator');
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

async function getCoffee(req, res) {
  const id = req.params.id;
  const coffee = await db.getRecord(tableName, id);
  const region = await db.getRecord('regions', coffee.region_id);
  coffee.region = region.name;
  coffee.flavorProfiles = await db.getCoffeeFlavorProfiles(id);

  res.render('detail', {
    title: coffee.name,
    path: 'coffee',
    item: coffee,
  });
}

async function deleteCoffee(req, res) {
  const id = req.params.id;
  await db.deleteCoffee(id);
  res.redirect('/');
}

const alphaErr = 'must only contain letters.';
const validateCoffee = [
  body('name').trim().isAlpha().withMessage(`Name ${alphaErr}`),
  body('description')
    .optional({ values: 'falsy' })
    .isAlpha()
    .withMessage(`Name ${alphaErr}`),
  body('price')
    .isCurrency({ allow_negatives: false })
    .withMessage('Invalid currency'),
  body('quantity')
    .isLength({ min: 0 })
    .withMessage('Quantity cannot be negative'),
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
      });
    }

    const data = req.body;
    await db.createCoffee(data);
    res.redirect('/');
  },
];

async function createCoffeeGET(req, res) {
  const regions = await db.getRecords('regions');
  const flavorProfiles = await db.getRecords('flavor_profiles');

  res.render('./forms/coffee-form', {
    regions,
    flavorProfiles,
  });
}

module.exports = {
  getCoffees,
  getCoffee,
  deleteCoffee,
  createCoffeePOST,
  createCoffeeGET,
};
