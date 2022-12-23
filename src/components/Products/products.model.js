const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new Schema({
    cod: { type: String, unique: true }, // #010114 (familia-categoria-id)
    desc: String,
    title:  { type: String, unique: true },
    img_uri: String,
    provider_uri: String,
    tags: [String],
    _price: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    _stock: {
        XXS: { type: Number, default: 0 },
        XS: { type: Number, default: 0 },
        S: { type: Number, default: 0 },
        M: { type: Number, default: 0 },
        L: { type: Number, default: 0 },
        XL: { type: Number, default: 0 },
        XXL: { type: Number, default: 0 },
    },
    stock: {
        XXS: { type: Number, default: 0 },
        XS: { type: Number, default: 0 },
        S: { type: Number, default: 0 },
        M: { type: Number, default: 0 },
        L: { type: Number, default: 0 },
        XL: { type: Number, default: 0 },
        XXL: { type: Number, default: 0 },
    }
}, {
    timestamps: true
})

productSchema.plugin(uniqueValidator);

module.exports = model('Product', productSchema)