const monogoose = require("mongoose")
const { Schema } = monogoose

const favorit = new Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true }
})

monogoose.model("FAVORIT", favorit);