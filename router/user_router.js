const router = require('express').Router();
const jwt = require('jsonwebtoken');
const createDB = require("../db/db");
const db = createDB();

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query(
        "select * from users where email = $1 and password = $2",
        [email, password],
        (error, results) => {
            if (error) {
                throw error;
            } else {
                if (results.rowCount === 0) {
                    res.status(401).json({
                        message: "Wrong user credentials",
                    });
                } else {
                    const { uuid, username } = results.rows[0];
                    res.status(200).json({
                        username: username,
                        user_id: uuid,
                        access_token: jwt.sign(
                            { name: username, uuid: uuid },
                            process.env.ACCESS_TOKEN_SECRET
                        ),
                    });
                }
            }
        }
    );
});

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

router.get('/restricted_test', checkToken, (req, res) => {
    res.status(200).json({secret: true});
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
