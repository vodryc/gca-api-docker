const pgPromise = require('pg-promise');

const pgp = pgPromise({});

const connection = {
  host: 'host.docker.internal',
  port: 35432,
  database: 'gca',
  user: 'postgres',
  password: 'Voodoo25',
};

const db = pgp(connection);

module.exports = db;