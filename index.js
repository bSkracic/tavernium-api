const express = require("express");
const bodyParser = require("body-parser");
const userCon = require("./controller/user_controller");
const loginCon = require("./controller/login_controller");

const app = express();

const PORT = 1337;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Tavernium Test API" });
});

/*
  ADMIN
*/
app.get("/api/users", userCon.getUsers);
app.get("/api/full_users", userCon.getFullUsers);
app.get("/api/users/:id", userCon.getUserById);
app.post("/api/users", userCon.createUser);
app.delete("/api/users", userCon.deleteUser);

/* PUBLIC WITH AUTH TOKEN */
app.put("/api/users/password_change", userCon.changePassword);

/*
  PUBLIC
*/
app.post("/api/login", loginCon.loginValidation);

app.listen(PORT, () => {
  console.clear();
  console.log("---------------------------");
  console.log(`\x1b[32m`, `App running on port: ${PORT}!`);
  console.log(`\x1b[37m`, `http://localhost:${PORT}\n`);
});
