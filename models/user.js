const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const { Schema } = mongoose;

function emailValid(val) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
}

var emailCheck = [emailValid, 'Invalid email']

const user = new Schema({
    firstName: { type: String, trim: true, lowercase: true, required: true },
    lastName: { type: String, trim: true, lowercase: true, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    birthdate: { type: String, required: true },
    email: { type: String, trim: true, unique: true, validate: emailCheck, required: true },
    password: { type: String, trim: true, minlength: 8, required: true },
    userName: { type: String, trim: true, unique: true, lowercase: true, required: true },
    phoneNumber: { type: String, unique: true, minlength: 10, required: true },
    secQes: { type: String, required: true },
    secAns: { type: String, required: true },
    signUpDate: { type: Date, default: Date.now },
    image: { type: String },
    tokens: [{ token: { type: String, required: true } }],
    admin: { type: Boolean, default: false },
    lock: { type: Boolean, default: false },

})
user.methods.generateToken = function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, keys.SECRET, { expiresIn: "24 hours" })
    user.tokens.push({ token: token })
    return user.save().then(user => {
        return Promise.resolve(token)
    }).catch(err => {
        return Promise.reject(err)
    })

}
user.statics.loginWithCred = function (email, password) {
    const user = this
    return new Promise((resolve, reject) => {
        user.findOne({ email: email }).then(user => {
            bcrypt.compare(password, user.password, function (error, res) {
                if (error) {
                    return reject(error)
                }
                if (res) {
                    return resolve(user)
                }
                if (!res) {
                    return reject("Incorrect password!")
                }
            })
        }).catch(err => {
            return reject("Email not found...")
        })
    })
}


user.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    return userObject
}

user.pre("save", async function () {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
})
mongoose.model("USER", user)