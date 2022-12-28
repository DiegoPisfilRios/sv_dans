const Product = require('./products.model')
const { cloudinary } = require('../../cloudinary')

const product = {}

product.search = async (req, res) => {
    // Extends...
    const { q } = req.query
    let keywords = q.split(' ')

    await Product.find({ $or: [{ tags: { $in: keywords } }, { cod: { $in: keywords } }] }, (err, docs) => {
        if (!err) return res.status(200).json({ data: docs })
        return res.status(500).send({ msg: err })
    })
    // return res.status(200).json({ search: keywords })
}

product.get = async (req, res) => {
    await Product.find((err, docs) => {
        if (err) return res.status(500).send({ msg: err })
        return res.status(200).json({ data: docs })
    });
}

product.post = async (req, res) => {
    if (!req.body) return res.status(401).send({ message: '=body: !' })
    const file_b64 = req.body.file
    delete req.body.file

    let body = req.body;

    body.stock = body._stock

    cloudinary.uploader.upload(file_b64, {
        public_id: body.cod,
        folder: 'dans',
        unique_filename: true
    }, async function (err, result) {
        if (err) {
            res.status(500).send({ message: 'Conflicto al subir la imagen' })
            console.log(err);
            return
        }

        let nProduct = new Product(body)
        nProduct.img_uri = result.secure_url;
        await nProduct.save((err, doc) => {
            if (err) return res.status(500).send({ msg: err });
            return res.status(200).json({ msg: doc });
        })
    })
}

product.getOne = async (req, res) => {
    const id = req.params.id;

    await Product.findOne({ cod: id }, (err, doc) => {
        if (err) return res.status(500).send({ msg: err })
        return res.status(200).json({ data: doc })
    })
}

product.removeOne = async (req, res) => {
    const id = req.params.id;

    await Product.findOneAndDelete({ cod: id }, (err, doc) => {
        if (err) return res.status(500).send({ msg: err })

        console.log('-> DELETE OK')

        cloudinary.uploader.destroy('dans/' + doc.cod, { invalidate: true, resource_type: 'image' })
            .then((result) => {
                console.log('-> ... CLD')
                console.log(result)
                return res.status(200).json({ data: doc })
            })
    })
}

product.patch = async (req, res) => {
    const id = req.params.id;
    const options = { new: true };

    let data = req.body;

    console.log(!data.file)

    if (data.file == '') {
        delete data.file

        console.log("-> INTO 1")
        await Product.findByIdAndUpdate({ cod: id }, data, options, (err, doc) => {
            if (err) return res.status(500).send({ msg: err })
            return res.status(200).json({ data: doc })
        })
        return res.status(200).json({ msg: 'ok' })
    } else {

        console.log("-> INTO 2")
  
        cloudinary.uploader.destroy('dans/' + data.cod, { invalidate: true, resource_type: 'image' }) // delete old image
            .then((result) => {
                console.log('-> ... CLD')
                console.log(result)

                cloudinary.uploader.upload(data.file, { // up new image
                    public_id: data.cod,
                    folder: 'dans',
                    unique_filename: true
                }, async function (err, result) {

                    if (err) {
                        res.status(500).send({ message: 'Conflicto al subir la imagen' })
                        console.log(err);
                        return
                    }

                    data.img_uri = result.secure_url;

                    await Product.findByIdAndUpdate({ cod: id }, data, options, (err, doc) => {
                        if (err) return res.status(500).send({ msg: err })
                        return res.status(200).json({ data: doc })
                    })
                })
            })
    }


}

module.exports = product;