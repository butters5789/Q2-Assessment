require('dotenv').load();

module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgresql://localhost/galvanize-reads'
  },
  seeds: {
    directory: './seeds/'
  },

  production: {
    client: 'postgresql',
    cconnection: process.env.DATABASE_URL,
    pool : {
      min: 2,
      max: 10
    }
  }

};
