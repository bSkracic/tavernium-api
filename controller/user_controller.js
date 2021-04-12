const db = require("./db/db");

const getUsers = (request, response) => {
  db.query("select * from users order by id", (error, results) => {
    if (error) {
      error;
    } else {
      response.status(200).json(results.rows);
    }
  });
};

const getFullUsers = (request, response) => {
  db.query(
    "select * from images inner join users on images.user_id = users.id",
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  db.query("select * from users where id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    } else {
      response.status(200).json(results.row);
    }
  });
};

module.exports = {
  getUsers,
  getFullUsers,
  getUserById,
};
