const Cart = require('./cart.model');
const { jsonResponse } = require('../../lib/jsonresponse')
const cart = {};

cart.read = async (req, res) => {
    const result = await Cart.find({}); 

    if (!result) return res.json(jsonResponse(500, { msg: 'Error' }))

    res.json(jsonResponse(200, { data: result }))
}

cart.readOne = (req, res) => {
    const { id } = req.params;

    Cart.findOne({ cod: id }, (err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200,{ data: doc }))
    })
}

cart.create = (req, res) => {
    const { body } = req;

    let nCart = new Cart(body)

    nCart.save((err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200, { data: doc }))
    })
}

cart.update = (req, res) => {
    const options = { new: true };
    const { body, params: { id } } = req;

    Cart.findOneAndUpdate({ cod: id }, body, options, (err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200, { data: doc }))
    })
}

cart.remove = (req, res) => {
    const { id } = req.params;

    Cart.findOneAndDelete({ cod: id }, (err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200, { data: doc }))
    })
}

module.exports = cart;