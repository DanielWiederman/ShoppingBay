const bcrypt = require("bcryptjs");

async function bcryptPassword(user) {
  if (user.password !== undefined) {
    user.password = await bcrypt.hash(user.password, 8);
    return user
  } else {
    return user
  }
}

module.exports = (req, res, next) => {
  bcryptPassword(req.body.userChange).then(res => {
    req.body.userChange = res
    next()
  }).catch(err => {
    res.send(err)
  })

}


