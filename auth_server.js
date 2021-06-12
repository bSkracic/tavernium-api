require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db/db");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/auth/register", (req, res) => {
  const { username, mail, password } = req.body;
  const uuid = uuidv4();
  db.query(
    "insert into users(uuid, username, email, password) values($1, $2, $3, $4)",
    [uuid, username, mail, password]
  )
    .then((results) => {
      res.status(201).json({ message: "User successfully registered" });
    })
    .catch(() => res.sendStatus(500));
});

app.post("/api/auth/login", (req, res) => {
  const { email, password, remember } = req.body;
  db.query("select * from users where email = $1 and password = $2", [
    email,
    password,
  ])
    .then((results) => {
      if (results.rowCount === 0) {
        res.status(401).json({
          message: "Invalid mail or pasword",
        });
      } else {
        const { uuid, username } = results.rows[0];
        const accessToken = generateAccessToken({
          uuid: uuid,
          username: username,
        });
        let refreshToken = null;
        if (remember) {
          refreshToken = jwt.sign(
            { uuid: uuid, username: username },
            process.env.REFRESH_TOKEN_SECRET
          );
          saveRefreshToken(refreshToken);
        }
        res.status(200).json({
          username: username,
          user_id: uuid,
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

app.post("/api/auth/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken === null) {
    res.sendStatus(401);
  }

  db.query("select * from refresh_tokens where token = $1", [refreshToken.toString()])
  .then((results) => {
    if(results.rowCount !== 1){
      return res.sendStatus(401);
    } else {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({
          uuid: user.uuid,
          username: user.username,
        });
        res.status(200).json({ access_token: accessToken });
      });
    }
  })
  .catch((e) => {
    console.log(e);
    return res.sendStatus(500);
  }); 
});

app.post("/api/auth/logout", (req, res) => {
  const token = req.body.token;
  db.query("delete from refresh_tokens where token = $1", [token])
    .then(() => {
      res.sendStatus(204);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

function saveRefreshToken(token) {
  const uuid = uuidv4();
  db.query("select save_refresh_token($1, $2)", [uuid, token])
  .then(r => {})
  .catch(e => console.log(e));
}

app.listen(6969, () => {
  console.log("Authentication service running on http://localhost:6969");
});
