const monogoose = require("mongoose")
const { Schema } = monogoose

const productReviews = new Schema({
    productId: { type: String, required: true },
    reviews: [{ userId: { type: String, required: true }, review: { type: String, required: true }, rating: { type: String, min: 1, max: 5 } }]
})

monogoose.model("PRODUCTREVIEWS", productReviews);