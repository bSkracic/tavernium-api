const router = require('express').Router();
const jwt = require('jsonwebtoken');
const createDB = require("../db/db");
const db = createDB();

const checkToken = (req, res, next) => {
    // auth header format: BEARER {token}
    const authHeaader = req.headers['authorization'];
    const token = authHeaader.split(" ")[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next();
    })
}

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
