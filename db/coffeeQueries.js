const pool = require('./pool');

async function getCoffees() {
  const { rows } = await pool.query('SELECT * FROM coffees');
  return rows;
}

async function getCoffee(id) {
  const { rows } = await pool.query('SELECT * FROM coffees WHERE id = $1', [
    id,
  ]);

  if (rows.length > 0) {
    return rows[0];
  }

  return null;
}

module.exports = {
  getCoffees,
  getCoffee,
};
