const monogoose = require("mongoose")
const { Schema } = monogoose

const order = new Schema({
    userId: { type: String, required: true },
    status: { type: String, default: "pending" }, 
    dateOfPurchased: { type: Date, default: Date.now }, 
    totalSum: { type: Number, required: true },
    products: [{ product: { type: Object, required: true }, buyQuantity: { type: Number, required: true } }]
})

monogoose.model("ORDER", order);