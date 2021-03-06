const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  // auth header format: BEARER {token}
  const authHeaader = req.headers['authorization'];
  const token = authHeaader.split(" ")[1];
  if(token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    req.user = user
    next();
  })
}
