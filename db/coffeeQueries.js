const pool = require('./pool');

async function getCoffees() {
  const { rows } = await pool.query('SELECT * FROM coffees');
  return rows;
}

module.exports = {
  getCoffees,
};
