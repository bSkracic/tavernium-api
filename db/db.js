const Pool = require("pg").Pool;
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tavernium_testdb",
  password: "password",
  port: 5432,
});

module.exports = db;
