const router = require('express').Router();
const db = require("../db/index");
const checkToken = require('../jwt/index');

router.post("/:campaign_id", (req, res) => {
    db.query("insert into campaigns_image(campaign_id, image) values($1, $2)", [req.params.campaign_id, req.body.image]).then(result => {
        
    }).catch((e) => {
        console.log(e);
        res.sendStatus(500);
    })
})