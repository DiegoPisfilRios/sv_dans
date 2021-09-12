const Product = require('./products.model')

const product = {}

product.search = async (req, res) => {
    // Extends...
    const { q } = req.query
    let keywords = q.split(' ')

    await Product.find({$or: [ {tags: { $in: keywords }}, {cod: {$in: keywords}}]}, (err, docs) => {
        if (!err) return res.status(200).json({data: docs})
        return res.status(500).send({msg: err})
    })
    // return res.status(200).json({ search: keywords })
}

product.get = async (req, res) => {
    await Product.find((err, docs) => {
        if (!err) return res.status(200).json({ data: docs })
        return res.status(500).send({ msg: err })
    });
}

product.post = async (req, res) => {
    const nProduct = new Product(req.body)
    await nProduct.save((err, doc) => {
        if (!err) return res.status(200).json({ msg: doc });
        return res.status(500).send({ msg: err });
    })
}

product.getOne = async (req, res) => {
    const id = req.params.id;

    await Product.findById(id, (err, doc) => {
        if (err) return res.status(500).send({ msg: err })
        return res.status(200).json({ data: doc })
    })
}

product.removeOne = async (req, res) => {
    const id = req.params.id;
    await Product.findByIdAndDelete(id, (err, doc) => {
        if (err) return res.status(500).send({ msg: err })
        return res.status(200).json({ data: doc })
    })
}

product.patch = async (req, res) => {
    const id = req.params.id;
    const options = { new: true };

    await Product.findByIdAndUpdate(id, req.body, options, (err, doc) => {
        if (err) return res.status(500).send({ msg: err })
        return res.status(200).json({ data: doc })
    })
}

module.exports = product;