const router = require('express').Router();
const db = require("../db/index");
const checkToken = require('../jwt/index');

router.get('/check_valid', checkToken, (req, res) => {
    res.status(200).json({ message: "Token is valid" })
})

router.put("/change_username", checkToken, (req, res) => {
    db.query("update users set username = $1 where uuid = $2", [req.body.username, req.user.uuid]).then(results => {
        res.sendStatus(200);
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    })
})

router.post("/change_password", checkToken, (req, res) => {
    const newPassword = req.body.new_password;
    const uuid = req.user.uuid;
    db.query("update users set password = $1 where uuid = $2", [newPassword, uuid], (err, results) => {
        if (err) {
            throw err;
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
