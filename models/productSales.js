const monogoose = require("mongoose")
const { Schema } = monogoose

const productSale = Schema({
    productID: { type: String },
    saleID: { type: String },
    count: { type: Number },
})



monogoose.model("productSale", productSale);