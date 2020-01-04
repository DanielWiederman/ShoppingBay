const monogoose = require("mongoose")
const { Schema } = monogoose

const img = new  Schema({
    img: { type: String},
})

monogoose.model("IMG", img);