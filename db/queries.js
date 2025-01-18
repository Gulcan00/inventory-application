const pool = require('./pool');

const TABLES = [
  'coffees',
  'regions',
  'flavor_profiles',
  'coffee_flavor_profiles',
];

async function getRecords(tableName) {
  if (!TABLES.includes(tableName)) {
    return;
  }

  const { rows } = await pool.query(`SELECT * FROM ${tableName}`);
  return rows;
}

async function getRecord(tableName, id) {
  if (!TABLES.includes(tableName)) {
    return;
  }

  const { rows } = await pool.query(
    `SELECT * FROM ${tableName} WHERE id = $1`,
    [id]
  );

  if (rows.length > 0) {
    return rows[0];
  }

  return null;
}

async function deleteRecord(tableName, id) {
  if (!TABLES.includes(tableName)) {
    return;
  }

  await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
}

async function createCoffee({
  name,
  description,
  roast_level,
  price,
  quantity,
}) {
  await pool.query(
    'INSERT INTO COFFEES (name, description, roast_level, price, quantity) VALUES ($1, $2, $3, $4, $5)',
    [name, description, roast_level, price, quantity]
  );
}

async function updateCoffee(
  id,
  { name, description, roast_level, price, quantity }
) {
  await pool.query(
    'UPDATE COFFEES SET name = $2, description = $3, roast_level = $4, price = $5, quantity = $6 WHERE id = $1',
    [id, name, description, roast_level, price, quantity]
  );
}

async function checkRegionIsInUse(regionId) {
  const { rows } = await pool.query(
    'SELECT * FROM coffees WHERE region_id = $1',
    [regionId]
  );
  return rows.length > 0;
}

async function checkFlavorProfileIsInUse(flavorProfileId) {
  const { rows } = await pool.query(
    'SELECT * FROM coffee_flavor_profiles WHERE flavor_profile_id = $1',
    [flavorProfileId]
  );
  return rows.length > 0;
}

async function deleteCoffee(id) {
  const { rows } = await pool.query(
    'SELECT * FROM coffee_flavor_profiles WHERE coffee_id = $1',
    [id]
  );

  for (let i = 0; i < rows.length; i++) {
    await deleteRecord('coffee_flavor_profiles', rows[i].id);
  }

  await deleteRecord('coffees', id);
}

module.exports = {
  getRecords,
  getRecord,
  deleteRecord,
  createCoffee,
  updateCoffee,
  deleteCoffee,
};
