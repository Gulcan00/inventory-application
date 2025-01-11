const db = require('../db/coffeeQueries');

async function getCoffees(req, res) {
  const items = await db.getCoffees();

  res.render('index', {
    title: 'Coffees',
    active: 'coffee',
    items,
  });
}

async function getCoffee(req, res) {
  const id = req.params.id;
  const coffee = await db.getCoffee(id);

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
