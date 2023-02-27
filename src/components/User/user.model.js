const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    surname_p: String,
    surname_m: String,
    phone: String,
    role: Number, // 0: super, 1: register, 2: confirm
    address: {
        address: String,
        reference: String,
        department: String,
        province: String,
        district: String
    }
}, {
    timestamps: true
});

module.exports = model('User', userSchema);