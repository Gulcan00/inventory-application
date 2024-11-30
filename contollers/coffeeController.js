const db = require('../db/coffeeQueries');

async function getCoffees(req, res) {
  const items = await db.getCoffees();

  res.render('items', {
    title: 'Coffees',
    items,
  });
}

module.exports = {
  getCoffees,
};
