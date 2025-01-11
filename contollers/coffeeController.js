const db = require('../db/coffeeQueries');

async function getCoffees(req, res) {
  const items = await db.getCoffees();

  res.render('index', {
    title: 'Coffees',
    active: 'coffee',
    items,
  });
}

module.exports = {
  getCoffees,
};
