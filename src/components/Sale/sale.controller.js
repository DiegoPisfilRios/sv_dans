const Sale = require('./sale.model');
const { jsonResponse } = require('../../lib/jsonresponse')

const sale = {}

sale.read = async (req, res) => {
    const result = await Sale.find({}); 

    if (!result) return res.json(jsonResponse(500, { msg: 'Error' }))

    res.json(jsonResponse(200, { data: result }))
}

sale.readOne = (req, res) => {
    const { id } = req.params;

    Sale.findOne({ cod: id }, (err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200,{ data: doc }))
    })
}

sale.create = (req, res) => {
    const { body } = req;

    let nSale = new Sale(body)

    nSale.save((err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200, { data: doc }))
    })
}

sale.update = (req, res) => {
    const options = { new: true };
    const { body, params: { id } } = req;

    Sale.findOneAndUpdate({ cod: id }, body, options, (err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200, { data: doc }))
    })
}

sale.remove = (req, res) => {
    const { id } = req.params;

    Sale.findOneAndDelete({ cod: id }, (err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200, { data: doc }))
    })
}

module.exports = sale;