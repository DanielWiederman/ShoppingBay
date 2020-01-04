const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
module.exports = (req, res , next) =>{//next stand for next chain in the middleware
    let token = req.header('token')
    try {
        var decoded = jwt.verify(token, keys.SECRET);
        next()
    } catch (error) {
      res.status(400).send("token not found")  
    }
}

//we need to make middleware to check if the email is exisiting already when we register and put it into the chain of new /api/user/new-user.