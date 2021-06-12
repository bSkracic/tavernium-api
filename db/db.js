const {Pool} = require('pg');

const pool = new Pool({
  user: "yqvruzss",
  host: "tai.db.elephantsql.com",
  database: "yqvruzss",
  password: "I1WRfdGsMSvVlULYPfudEHHyQK-00mIi",
  port: 5432,
});

module.exports = {
    query: (text, params) => {
        return pool.query(text, params)
            .then(res => {
                return res;
            });
    }
}