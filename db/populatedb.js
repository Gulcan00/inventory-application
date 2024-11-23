const { argv } = require('node:process');
const { Client } = require('pg');

const SQL = `
    CREATE TABLE IF NOT EXISTS regions (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255)
    );

    CREATE TABLE IF NOT EXISTS roast_levels (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        level INTEGER
    );

    CREATE TABLE IF NOT EXISTS flavor_profiles (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        profile VARCHAR (255)
    );

    CREATE TABLE IF NOT EXISTS coffees (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255),
        description VARCHAR (255),
        price NUMERIC,
        quantity INTEGER,
        region_id INTEGER REFERENCES regions (id),
        roast_level_id INTEGER REFERENCES roast_levels (id)
    );

    CREATE TABLE IF NOT EXISTS coffee_flavor_profiles (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        coffee_id INTEGER REFERENCES coffees (id),
        flavor_profile_id INTEGER REFERENCES flavor_profiles (id)
    );
`;

async function main() {
  const [node, script, url] = argv;
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query(SQL);
  await client.end();
}

main();
