const router = require("express").Router();
const db = require("../db/db");
const checkToken = require('../jwt/jwt');

router.post("/campaign/search", (req, res) => {
  db.query(
    `select * from get_campaignbyname($1, $2)`,
    [req.query.term, req.body.user_id]
  )
    .then((r) => {
      res.status(200).json(r.rows);
    })
    .catch((e) => {
      res.sendStatus(500);
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
    .catch(() => res.sendStatus(500));
});

router.post("/campaign/joined", (req, res) => {
  db.query(
    "select campaigns.id, campaigns.title, campaigns.thematics, users.username as owner from campaigns_user inner join campaigns on campaigns.id = campaigns_user.campaign_id inner join users on campaigns.user_starter_id = users.uuid where user_id = $1",
    [req.body.user_id]
  )
    .then((r) => {
      res.status(200).json(r.rows);
    })
    .catch((e) => res.sendStatus(500));
});

router.post("/campaign/join", checkToken, (req, res) => {
  db.query("insert into campaigns_user(user_id, sheet_id, campaign_id) values($1, $2, $3)", 
  [req.body.user_id, req.body.sheet_id, req.body.campaign_id])
  .then(() => {
    res.sendStatus(201);
  })
  .catch(() => {
    res.sendStatus(500);
  });
});

router.put("/campaign/edit", (req, res) => {
  db.query("update campaigns set title = $1, thematics = $2 where id = $3", [req.body.title, req.body.thematics, req.body.id]).then(r => {
    res.status(200).json('update successful');
  }).catch(e => {
    res.sendStatus(500);
  })
})

router.post("/campaign/edit", checkToken, (req, res) => {
  db.query("insert into campaigns(user_starter_id, title, thematics) values($1, $2, $3)", [req.user.uuid, req.body.title, req.body.thematics])
  .then(() => res.sendStatus(201))
  .catch((e) => {
    console.log(e)
    res.sendStatus(500)
  })
})

router.delete("/campaign/edit", checkToken, (req, res) => {
  db.query("delete from campaigns where id = $1", [req.body.id])
  .then(r => {
    res.sendStatus(204);
  })
  .catch(e => {
    console.log(e);
    res.sendStatus(500);
  })
})

module.exports = router;
