const router = require('express').Router();
const createDB = require('../db/db');
const db = createDB();

router.get("/messages/room/:roomID", (req, res) => {
    db.query('select * from messages where campaign_id = $1 order by created_at', [req.params.roomID]).then(r => {
        res.status(200).json(r.rows);
    }).catch(e => {
        res.status(500);
    })
});

module.exports = router;