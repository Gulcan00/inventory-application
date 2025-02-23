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
      // TODO return 404 page
    }

    const id = req.params.id;
    const region = await db.getRecord(tableName, id);
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
      const errorMsg = errors[0].msg;
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

    if (!errors.isEmpty) {
      //404
    }

    const id = req.params.id;
    if (await db.checkRegionIsInUse(id)) {
      return getRegion();
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
