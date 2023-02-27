const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const cartSchema = new Schema({
    cod: { type: String, unique: true },
    client: String,
    products:[Object]
}, {
    timestamps: true
})

cartSchema.plugin(uniqueValidator);

module.exports = model('Cart', cartSchema);

/*
{
    cod: 'CDS-00001',
    client: '71429904',
    products: [
        {
            cod: *****,
            cant: 4,
            talla: m
        }
    ]
}
*/