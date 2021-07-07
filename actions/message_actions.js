const router = require('express').Router();
const db = require("../db/index");

router.get("/messages/room/:roomID", (req, res) => {
    db.query('select * from messages where campaign_id = $1 order by created_at', [req.params.roomID]).then(r => {
        res.status(200).json(r.rows);
    }).catch(e => {
        res.sendStatus(500);
    })
});

module.exports = router;    