// build your `Resource` model here
const db = require("../../data/dbConfig.js");
const jwt = require('jsonwebtoken'); // installed this library

module.exports = {
  createNewUser,
  getUserByNamePass,
  getUserByName,
  generateToken,
  validateToken,
};

function get(id) {
  if (id) {
    return db("users as u").where("u.id", id).first().then(function(user) {
      if (user) {
        return user;
      } else {
        return null;
      }
    });
  }

  return null;
}

function getUserByNamePass(userName, hashPassword) {
  return db("users as u").where({
    "u.username": userName,
    "u.password": hashPassword
  }).first().then(user => {
    return user;
  });
}

function getUserByName(userName) {
    return db("users as u").where({
      "u.username": userName
    }).first().then(user => {
      return user;
    });
  }

function createNewUser(user) {
  return db("users")
    .insert(user)
    .then(([id]) => get(id));
}

function generateToken(user) {
    const payload = {
      subject: user.id, // sub in payload is what the token is about
      username: user.username,
      // ...otherData
    };
  
    const options = {
      expiresIn: '1d', // show other available options in the library's documentation
    };
  
    // extract the secret away so it can be required and used where needed
    return jwt.sign(payload, "secret_key", options); // this method is synchronous
  }

  function validateToken(token){
    return jwt.verify(token, 'shhhhh');
  }
