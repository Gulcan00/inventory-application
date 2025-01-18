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

module.exports = {
  getCoffees,
  getCoffee,
};
