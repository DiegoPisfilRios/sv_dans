const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const saleSchema = new Schema({
    cod: { type: String, unique: true },
    client: String,
    products: [Object],
    resume: {
        off: Number,
        subtotal: Number,
        total: Number
    }
}, {
    timestamps: true
})

saleSchema.plugin(uniqueValidator);
saleSchema.plugin(mongoosePaginate);

module.exports = model('Sale', saleSchema)

/*
{
    cod: 'SDS-00001',
    note: 'xxxxxx xxx xxxx',
    client: '71429904',
    products: [
        {
            cod: *****,
            cant: 4,
            talla: m
        }
    ],
    resume: {
        off: 14,
        subtotal: 45,
        total: 50
    }
}
*/