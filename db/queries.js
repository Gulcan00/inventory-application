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
  roastLevel,
  regionId,
  price,
  quantity,
  flavorProfileIds,
}) {
  const { rows } = await pool.query(
    'INSERT INTO coffees (name, description, roast_level, region_id, price, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [name, description, roastLevel, regionId, price, quantity]
  );

  for (let flavorProfileId of flavorProfileIds) {
    await pool.query(
      'INSERT INTO coffee_flavor_profiles (coffee_id, flavor_profile_id) VALUES ($1, $2)',
      [rows[0].id, flavorProfileId]
    );
  }
}

async function updateCoffee(
  id,
  { name, description, roastLevel, regionId, price, quantity, flavorProfileIds }
) {
  await pool.query(
    'UPDATE coffees SET name = $2, description = $3, roast_level = $4, region_id = $5, price = $6, quantity = $7 WHERE id = $1',
    [id, name, description, roastLevel, regionId, price, quantity]
  );

  const { rows: currentFlavorProfiles } = await pool.query(
    'SELECT * FROM coffee_flavor_profiles WHERE coffee_id = $1',
    [id]
  );

  const deleteFlavorProfiles = currentFlavorProfiles.filter(
    (coffeeFlavorProfile) =>
      !flavorProfileIds.includes(coffeeFlavorProfile.flavor_profile_id)
  );
  await Promise.all(
    deleteFlavorProfiles.map((coffeeFlavorProfile) =>
      deleteRecord(
        'coffee_flavor_profiles',
        coffeeFlavorProfile.flavor_profile_id
      )
    )
  );

  const currentFlavorProfileIds = new Set(
    currentFlavorProfiles.map(
      (coffeeFlavorProfile) => coffeeFlavorProfile.flavor_profile_id
    )
  );
  const addFlavorProfileIds = flavorProfileIds.filter(
    (flavorProfileId) => !currentFlavorProfileIds.has(flavorProfileId)
  );
  await Promise.all(
    addFlavorProfileIds.map((flavorProfileId) =>
      createCoffeeFlavorProfile(id, flavorProfileId)
    )
  );
}

async function deleteCoffee(id) {
  await pool.query('DELETE FROM coffee_flavor_profiles WHERE coffee_id = $1', [
    id,
  ]);

  await deleteRecord('coffees', id);
}

async function createCoffeeFlavorProfile(coffeeId, flavorProfileId) {
  await pool.query(
    'INSERT INTO coffee_flavor_profiles (coffee_id, flavor_profile_id) VALUES ($1, $2)',
    [coffeeId, flavorProfileId]
  );
}

async function getCoffeeFlavorProfiles(coffeeId) {
  const { rows } = await pool.query(
    'SELECT fp.id, fp.name FROM flavor_profiles fp JOIN coffee_flavor_profiles cfp ON fp.id = cfp.flavor_profile_id WHERE cfp.coffee_id = $1',
    [coffeeId]
  );

  return rows;
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

module.exports = {
  getRecords,
  getRecord,
  deleteRecord,
  createCoffee,
  updateCoffee,
  deleteCoffee,
  getCoffeeFlavorProfiles,
};
