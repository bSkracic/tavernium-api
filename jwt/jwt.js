const jwt = require('jsonwebtoken');
const db = require('../db/db');

/*
  Middleware method for checking validity of an access token
*/
const checkToken = (req, res, next) => {
    // Auth header format: BEARER {token}
    
    const authHeaader = req.headers["authorization"];
    const token = authHeaader.split(" ")[1];
    const refreshToken = req.body.refresh_token; 
    
    if (token === null) {
      return res.sendStatus(401);
    } 
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
     if (err) {
        return res.sendStatus(403);
      }
      else {
        req.user = user;
        next();
      }
    });
  };

module.exports = checkToken;