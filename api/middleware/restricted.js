const jwt = require('jsonwebtoken'); // installed this library

module.exports = (req, res, next) => {
  
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

    const token = req.headers.authorization

    if(!token){
      return res.status(400).json({ message: 'token required'}); 
    }

    jwt.verify(token,'secret_key',(err,user) => {
        console.log(err);

        if (err) return res.status(403).json("token invalid")
        req.user = user;
        next();
    })
};
