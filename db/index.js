const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.BUILD == 'DEV' ? 'postgres' : process.env.DB_USER,
    host: process.env.BUILD == 'DEV' ? 'localhost' : process.env.DB_HOST,
    database: process.env.BUILD == 'DEV' ? 'tahook_db' : process.env.DB_NAME ,
    password: process.env.BUILD == 'DEV' ? 'supersecretpassword' : process.env.DB_PASSWORD,
    port: process.env.BUILD === 'DEV' ? 5432 : process.env.DB_PORT,
});

module.exports = {
    pool: pool,
    query: (text, params) => {
        return pool.query(text, params)
            .then(res => {
                return res;
            });
    }
}
