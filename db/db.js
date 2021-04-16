const Pool = require("pg").Pool;
const createDB = () => {
  return new Pool({
    user: "postgres",
    host: "localhost",
    database: "tavernium_testdb",
    password: "supersecretpassword",
    port: 5432,
  });
};

module.exports = createDB;
