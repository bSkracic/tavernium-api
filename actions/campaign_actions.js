const router = require("express").Router();
const createDB = require("../db/db");

const db = createDB();

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

router.get("/campaign/search", (req, res) => {
  console.log(req.query.term);
  db.query(
    `select campaigns.id, campaigns.title, campaigns.thematics, users.username from campaigns inner join users on users.uuid = campaigns.user_starter_id where campaigns.title like '${req.query.term}%'`
  )
    .then((r) => {
      res.status(200).json(r.rows);
    })
    .catch((e) => {
      console.log(e);
      res.status(500);
    });
});

router.post("/campaign/user", (req, res) => {
  db.query(
    "select campaigns.id, campaigns.title, campaigns.thematics, users.username as owner from campaigns inner join users on users.uuid = campaigns.user_starter_id where campaigns.user_starter_id = $1",
    [req.body.user_id]
  )
    .then((r) => {
      res.status(200).json(r.rows);
    })
    .catch(() => res.status(500));
});

router.post("/campaign/joined", (req, res) => {
  db.query(
    "select campaigns.id, campaigns.title, campaigns.thematics, users.username as owner from campaigns_user inner join campaigns on campaigns.id = campaigns_user.campaign_id inner join users on campaigns.user_starter_id = users.uuid where user_id = $1",
    [req.body.user_id]
  )
    .then((r) => {
      res.status(200).json(r.rows);
    })
    .catch((e) => {res.status(500)});
});

// router.post("/campaign/join");

module.exports = router;
