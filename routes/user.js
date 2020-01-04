const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const keys = require('../config/keys')
const bcryptPassword = require('../middleware/bcryptPassword')
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const moment = require("moment");
mongoose.set('useFindAndModify', false);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shoppingbay2@gmail.com',
        pass: 'A159632147a'
    }
});

module.exports = (app) => {

    app.post("/api/shoppingbay/add-user", (req, res) => {
        let user = new USER(req.body)
        user.save().then(user => {
            return user.generateToken().then(token => {
                res.status(200).send({ email: user.email, token })
            }).catch(err => {
                res.status(400).send(err)
            })
        })
            .catch(err => {
                res.status(400).send(err)
            })
    })

    app.post("/api/shoppingbay/update-user", bcryptPassword, (req, res) => {
        USER.findOneAndUpdate({ email: req.body.email }, req.body.userChange).then(user => {
            res.send(user)
        }).catch(err => {
            res.send(err)
        })
    })

    app.get("/api/shoppingbay/loginWithToken", auth, (req, res) => {
        let token = req.header('token')
        var decoded = jwt.verify(token, keys.SECRET);
        USER.findById(decoded._id).then(user => {
            res.status(200).send(user)
        }).catch(err => {
            res.status(400).send(err)
        })
    })

    app.post("/api/shoppingbay/loginWithCred", (req, res) => {
        USER.loginWithCred(req.body.email, req.body.password).then(user => {
            if (!user.lock) {
                return user.generateToken().then(ans => {
                    res.status(200).send(user)
                })
            } else {
                res.status(400).json({ type: 'error', msg: "this user is locked" });
            }

        }).catch(err => {
            res.status(400).json({ type: 'error', msg: err });
        })

    })
    app.post("/api/shoppingbay/contact-email-sender", (req, res) => {
        USER.findOne({ email: req.body.email }).then(user => {
            if (user !== undefined) {
                var mailOptions = {
                    from: 'shoppingbay2@gmail.com',
                    to: req.body.email,
                    subject: 'Shoppingbay',
                    text: req.body.emailBody,
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        res.status(400).json({ type: 'error', msg: err });
                    } else {
                        res.status(200).json({ type: 'success', msg: "Email was sended to" + req.body.email });
                    }
                })
            } else {
                res.status(400).json({ type: 'error', msg: "emaill incorrect" });
            }

        })
    })
    app.post("/api/shoppingbay/forgot-password", (req, res) => {
        USER.findOne({ email: req.body.email }).then(user => {
            if (user !== undefined) {
                var mailOptions = {
                    from: 'shoppingbay2@gmail.com',
                    to: req.body.email,
                    subject: 'Shoppingbay-New password',
                    text: 'Your new password is ' + req.body.userChange.password
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        res.status(400).json({ type: 'error', msg: err });
                    } else {
                        res.status(200).json({ type: 'success', msg: "Your new password was sended to your mail" });
                    }
                })
            } else {
                res.status(400).json({ type: 'error', msg: "emaill incorrect" });
            }

        }).catch(err => {
            res.send("user Not found");
        })
    })
    app.post("/api/shoppingbay/get-user", (req, res) => {
        USER.findOne({ email: req.body.email }).then(user => {
            res.send(user)
        }).catch(err => {
            res.send(err)
        })
    })
    app.post("/api/shoppingbay/delete-user", (req, res) => {
        USER.findOne({ email: req.body.email }).then(user => {
            new Promise((resolve, reject) => {
                bcrypt.compare(req.body.password, user.password, function (error, bcryptRes) {

                    if (error) {
                        reject(error)
                    }
                    if (bcryptRes) {
                        resolve("Valid")
                    }
                    if (!bcryptRes) {

                        reject(error)
                    }
                })
            }).then(bcryptRes => {
                if (bcryptRes === "Valid") {
                    USER.findOneAndDelete({ email: user.email }).then(deleteRes => {
                        res.send("userWasDelete")
                    }).catch(err => {
                        res.send(err)
                    })
                }

            }).catch(err => {
                res.send("Incorrect password!")
            })
        }).catch(err => {

            res.send(err)
        })

    })

    app.post("/api/user/logout-user", (req, res) => {
        let token = req.header("token")
        USER.findOne({ email: req.body.email }).then(user => {
            let newArrayToken = user.tokens.filter(index => index.token !== token)
            user.tokens = newArrayToken
            user.save().then(user => {
                res.status(200).send("ok")
            })
        }).catch(err => {
            res.status(400).send("bad")
        })
    })
    app.post("/api/shoppingbay/get-all-users", (req, res) => {
        USER.find().lean().then(users => {
            users.map(index => {
                let userBirthdate = moment(index.birthdate, "DD-MM-YYYY")
                var nowDate = new Date()
                nowDate = moment(nowDate, "DD-MM-YYYY")
                index.age = nowDate.diff(userBirthdate, 'years');
                index.firstName = index.firstName.charAt(0).toUpperCase() + index.firstName.slice(1)
                index.lastName = index.lastName.charAt(0).toUpperCase() + index.lastName.slice(1)
                index.fullName = index.firstName + " " + index.lastName;
                index.tokens = undefined
                index.secQes = undefined
                index.secAns = undefined
            })
            res.send(users)
        }).catch(err => {
            res.send(err)
        })
    })


}