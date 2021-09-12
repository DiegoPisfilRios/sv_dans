const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new Schema({
    cod: { type: String, unique: true },
    desc: String,
    img: String,
    tags: [String],
    init_stock: Number,
    stock: { type: Number, default: 0 },
    price: Number,
    value: Number,
    size: {
        XXS: {type: Boolean, default: false },
        XS: {type: Boolean, default: false },
        S: {type: Boolean, default: false },
        M: {type: Boolean, default: false },
        L: {type: Boolean, default: false },
        XL: {type: Boolean, default: false },
        XXL: {type: Boolean, default: false },
    }
},{
    timestamps: true
})

productSchema.plugin(uniqueValidator);

module.exports = model('Product', productSchema)