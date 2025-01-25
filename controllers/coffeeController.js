const db = require('../db/queries');
const tableName = 'coffees';

async function getCoffees(req, res) {
  const columns = ['name', 'description', 'roast_level', 'price', 'quantity'];
  const items = await db.getRecords(tableName);

  res.render('items-list', {
    columns,
    rows: items,
  });
}

async function getCoffee(req, res) {
  const id = req.params.id;
  const coffee = await db.getRecord(tableName, id);

  res.render('detail', {
    title: coffee.name,
    active: 'coffee',
    item: coffee,
  });
}

async function deleteCoffee(req, res) {
  const id = req.params.id;
  await db.deleteCoffee(id);
  res.redirect('/');
}

async function createCoffeePOST(req, res) {
  const data = req.body;
  await db.createCoffee(data);
  res.redirect('/');
}

async function createCoffeeGET(req, res) {
  res.render('./forms/coffee-form');
}

module.exports = {
  getCoffees,
  getCoffee,
  deleteCoffee,
  createCoffeePOST,
  createCoffeeGET,
};
