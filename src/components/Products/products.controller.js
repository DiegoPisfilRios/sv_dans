const Product = require('./products.model')
const { cloudinary } = require('../../cloudinary')
const { jsonResponse } = require('../../lib/jsonresponse')

const product = {}

product.search = async (req, res) => {
    let text = req.query.q || ''
    let all = req.query.all || null;
    let title =  req.query.name || null;
    let tag = req.query.tag || null;
    let cod = req.query.cod || null;

    // prepare find options
    let findQuery = { $or: [] };

    if (title)
        findQuery.$or.push({ title: { $regex: text, $options: 'i' } })

    if (tag)
        findQuery.$or.push({ tags: { $regex: text, $options: 'i' } })

    if (cod)
        findQuery.$or.push({ cod: { $regex: text, $options: 'i' } })

    if (all) {
        findQuery.$or.push({ cod: { $regex: text, $options: 'i' } })
        findQuery.$or.push({ title: { $regex: text, $options: 'i' } })
        findQuery.$or.push({ tags: { $regex: text, $options: 'i' } })
    }

    const result = await Product.find({ ...findQuery });
    if (result == null) return res.status(500).send({ msg: 'Error' }) 
    
    return res.json(jsonResponse(200, { data: result }))
}

product.read = async (req, res) => { //? app:home
   const result = await Product.find({});

   if (result == null) return res.status(500).send({ msg: 'Error' }) 

   return res.status(200).json({ data: result })
}

product.create = async (req, res) => { //? app:new
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
            res.json(jsonResponse(500, { message: 'Conflicto al subir la imagen' }))
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

product.readOne = async (req, res) => {
    const { id } = req.params;

    await Product.findOne({ cod: id }, (err, doc) => {
        if (err) return res.status(500).send({ msg: err })
        return res.status(200).json({ data: doc })
    })
}

product.remove = async (req, res) => {
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

product.update = async (req, res) => {
    const id = req.params.id;
    const options = { new: true };

    let data = req.body;

    console.log(typeof data.file)

    if (typeof data.file == 'undefined') { //* actualización solo de texto plano
        delete data.file //* eliminamos campo

        console.log("-> TEXTO PLANO")
        await Product.findOneAndUpdate({ cod: id }, data, options, (err, doc) => {
            if (err) return res.status(500).send({ msg: err })
            return res.status(200).json({ data: doc })
        })
    } else { //* actualización con imagen

        console.log("-> TEXTO Y IMAGEN.  pic_ID:" + data.cod)

        cloudinary.uploader.destroy('dans/' + data.cod, { invalidate: true, resource_type: 'image' }) // delete old image
            .then((result) => {
                console.log('-> ... CLS')
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

                    await Product.findOneAndUpdate({ cod: id }, data, options, (err, doc) => {
                        if (err) return res.status(500).send({ msg: err })
                        return res.status(200).json({ data: doc })
                    })
                })
            })
    }


}
 
module.exports = product;