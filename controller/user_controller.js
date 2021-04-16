const { v4: uuidv4 } = require("uuid");
const createDB = require("../db/db");
const db = createDB();

const getUsers = (request, response) => {
  db.query("select * from users order by uuid", (error, results) => {
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
  db.query(
    "select * from users where uuid = $1",
    [request.params.id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const createUser = (request, response) => {
  const { username, password, email } = request.body;
  const uuid = uuidv4();
  db.query(
    "insert into users(uuid, username, email, password) values($1, $2, $3, $4)",
    [uuid, username, email, password],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(201).json({
          message: `User successfully created`,
          user_id: uuid,
        });
      }
    }
  );
};

// TODO: should only be able to do with auth token
const changePassword = (request, response) => {
  const { user_id, new_password } = request.body;
  db.query(
    "update users set password = $1 where uuid = $2",
    [new_password, user_id],
    (error, results) => {
      if(error) {
        throw error;
      } else {
        response.status(200).json({message: "Password updated"});
      }
    }
  );
};


const deleteUser = (request, response) => {
  const uuid = request.params.id;
  db.query("delete from users where uuid = $1", [uuid], (error, results) => {
    if(error){
      throw error;
    } else {
      response.status(200).json({message: "User deleted"});
    }
  });
};

module.exports = {
  getUsers,
  getFullUsers,
  getUserById,
  createUser,
  changePassword,
  deleteUser
};
