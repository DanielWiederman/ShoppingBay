const monogoose = require("mongoose")
const { Schema } = monogoose

const hotProducts = new Schema({
    prods: [{ prodId: { type: String, required: true } }],
})

monogoose.model("HOTPRODUCTS", hotProducts);