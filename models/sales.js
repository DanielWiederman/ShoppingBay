const monogoose = require("mongoose")
const { Schema } = monogoose

const sales = new Schema({
    saleName: { type: String, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    prods: [{ prodId: { type: String, required: true }, newPrice: { type: Number, required: true }, status: { type: Boolean, require: true, default: true } }],
    status: { type: Boolean, required: true },
    image: { type: String, required: true },
})

monogoose.model("SALES", sales);