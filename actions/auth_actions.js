const router = require('express').Router();
const db = require('../db/db');
const checkToken = require('../jwt/jwt');

router.get('/check_valid', checkToken, (req, res) => {
    res.status(200).json({message: "Token is valid"})
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
