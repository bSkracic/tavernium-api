const createDB = require("../db/db");
const db = createDB();

const loginValidation = (request, response) => {
  const { email, password } = request.body;
  db.query(
    "select * from users where email = $1 and password = $2",
    [email, password],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        if (results.rowCount === 0) {
          response.status(401).json({
            message: "Wrong user credentials",
          });
        } else {
          const { uuid, username } = results.rows[0];
          response.status(200).json({
            user_id: uuid,
            username: username,
          });
        }
      }
    }
  );
};

module.exports = {
  loginValidation,
};
