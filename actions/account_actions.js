const router = require("express").Router();
const createDB = require("../db/db");
const jwt = require("jsonwebtoken");
const db = createDB();

// DEBUG
router.get("/acc/all_avatars", (req, res) => {
  db.query("select * from avatars")
    .then((r) => {
      res.status(200).json(r.rows);
    })
    .catch((e) => {
      res.status(500);
    });
});

// DEBUG

router.post("/acc/avatar", (req, res) => {
  const userID = req.body.user_id;

  db.query("select image from avatars where user_id = $1", [userID])
    .then((results) => {
      let image = null;
      if (results.rowCount !== 0) {
        image = results.rows[0].image;
      }
      res.status(200).json({ image: image });
    })
    .catch((e) => {
      res.status(500).json({ message: "Server error" });
    });
});

const checkToken = (req, res, next) => {
  // auth header format: BEARER {token}
  const authHeaader = req.headers["authorization"];
  const token = authHeaader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.put("/acc/avatar", checkToken, (req, res) => {
  db.query("select set_avataruser($1, $2)", [req.user.uuid, req.body.image])
    .then((results) => {
      if (
        results.rows[0].set_avataruser === 1 ||
        results.rows[0].set_avataruser === 1
      ) {
        res.status(200);
      }
    })
    .catch((e) => {
      res.status(500);
    });
});

module.exports = router;
