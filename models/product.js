const monogoose = require("mongoose")
const { Schema } = monogoose

const product = new Schema({

    productName: { type: String, trim: true, lowercase: true, required: true },
    brand: { type: String, trim: true, lowercase: true, required: true },
    category: { type: String, trim: true, lowercase: true, required: true },
    price: { type: String, min: 1, required: true },
    quantity: { type: String, required: true },
    hotProd: {type: Boolean, default: false},
    image: { type: String },
})

monogoose.model("PRODUCT", product);