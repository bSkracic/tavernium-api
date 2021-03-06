const router = require("express").Router();
const db = require("../db/index");
const checkToken = require("../jwt/index")

router.get("/acc/all_avatars", (req, res) => {
  db.query("select * from avatars")
    .then((r) => {
      res.status(200).json(r.rows);
    })
    .catch((e) => {
      res.status(500);
    });
});

router.post("/acc/avatar", (req, res) => {
  const userID = req.body.user_id;

  db.query("select image from avatars where user_id = $1", [userID])
    .then((results) => {
      let image = null;
      if (results.rowCount !== 0) {
        image = results.rows[0].image;
      }
      res.tatus(200).json({ image: image });
    })
    .catch((e) => {
      res.status(500).json({ message: "Server error" });
    });
});


router.get("/acc/avatar", checkToken, (req, res) => {
  const userID = req.user.uuid;

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

router.put("/acc/avatar", checkToken, (req, res) => {
  db.query("select set_avataruser($1, $2)", [req.user.uuid, req.body.image])
    .then((results) => {
      res.sendStatus(200);
    })
    .catch((e) => {
      res.status(500).json({message: "Server error."});
    });
});

module.exports = router;

module.exports = router;
