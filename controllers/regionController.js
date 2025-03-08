const { param, body, validationResult } = require('express-validator');
const db = require('../db/queries');
const tableName = 'regions';

async function getRegions(req, res) {
  const columns = ['name'];
  const items = await db.getRecords(tableName);

  res.render('items-list', {
    columns,
    rows: items,
    path: 'region',
  });
}

const getRegion = [
  param('id').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).render('error', {
        error: 'Invalid id for region',
      });
    }

    const id = req.params.id;
    const region = await db.getRecord(tableName, id);

    if (!region) {
      res.status(404).render('error', {
        error: `Region with id ${id} does not exist`,
      });
    }

    res.render('detail', {
      title: region.name,
      path: 'region',
      item: region,
    });
  },
];

const validateRegion = body('name')
  .trim()
  .isAlpha('en-US', { ignore: ' ' })
  .withMessage('Name must only contain letters.');

const createRegionPOST = [
  validateRegion,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMsg = errors.array()[0].msg;
      return res.status(400).render('./forms/form', {
        path: 'region',
        error: errorMsg,
        data: {},
      });
    }

    const { name } = req.body;
    await db.createRecord(tableName, name);
    res.redirect('/region');
  },
];

async function createRegionGET(req, res) {
  const id = req.params.id;

  if (id) {
    const region = await db.getRecord(tableName, id);
    res.render('./forms/form', {
      path: 'region',
      data: region,
    });
  } else {
    res.render('./forms/form', {
      path: 'region',
      data: {},
    });
  }
}

const updateRegion = [
  validateRegion,
  async (req, res) => {
    const id = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const region = await db.getRecord(tableName, id);
      const errorMsg = errors[0].msg;
      return res.status(400).render('./forms/form', {
        path: 'region',
        error: errorMsg,
        data: region,
      });
    }

    const { name } = req.body;
    await db.updateRecord(tableName, { id, name });
    res.redirect('/region');
  },
];

const deleteRegion = [
  param('id').isNumeric(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('error', {
        error: 'Invalid id for region',
      });
    }

    const id = req.params.id;
    if (await db.checkRegionIsInUse(id)) {
      res.status(405).render('error', {
        error:
          'This region is currently assigned to one or more coffees. To delete it, please reassign those coffees to a different region.',
        code: 405,
      });
    } else {
      next();
    }
  },
  async (req, res) => {
    const id = req.params.id;
    await db.deleteRecord(tableName, id);
    res.redirect('/region');
  },
];

module.exports = {
  getRegions,
  getRegion,
  createRegionPOST,
  createRegionGET,
  updateRegion,
  deleteRegion,
};
