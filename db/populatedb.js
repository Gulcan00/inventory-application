const { argv } = require('node:process');
const { Client } = require('pg');

const SQL = `
    CREATE TABLE IF NOT EXISTS regions (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255)
    );

    CREATE TABLE IF NOT EXISTS flavor_profiles (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255)
    );

    CREATE TABLE IF NOT EXISTS coffees (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255),
        description VARCHAR (255),
        roast_level INTEGER,
        price NUMERIC,
        quantity INTEGER,
        region_id INTEGER REFERENCES regions (id)
    );

    CREATE TABLE IF NOT EXISTS coffee_flavor_profiles (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        coffee_id INTEGER REFERENCES coffees (id),
        flavor_profile_id INTEGER REFERENCES flavor_profiles (id)
    );

    INSERT INTO regions (name) VALUES 
    ('Central America'), ('Africa');

    INSERT INTO flavor_profiles (name) VALUES 
    ('Cocoa'), ('Hazelnut'), ('Dark Chocolate'), ('Molasses');

    INSERT INTO coffees (name, description, roast_level, price, quantity, region_id) VALUES
    ('Harvest Moon', 'A smooth and earthy blend with notes of cocoa and hazelnut', 3, 9.99, 10, 1),
    ('Wildfire', 'A bold and smoky blend with notes of dark chocolate and molasses', 5, 12.99, 7, 2);
    
    INSERT INTO coffee_flavor_profiles (coffee_id, flavor_profile_id) VALUES 
    (1, 1),
    (1, 2),
    (2, 3),
    (2, 4);
`;

async function main() {
  const [node, script, url] = argv;
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query(SQL);
  await client.end();
}

main();
