'use strict'

const cpublic = {}
const Public = require('../models/model.public')
const { cloudinary } = require('../services/cloudinary')
const User = require('../models/model.user')

cpublic.get = async (req, res) => {

    const search = req.query.search ? req.query.search : ""

    //console.log(search) `/.*${search}.*/`

    const limit = parseInt(req.query.limit, 10) || 8
    const page = parseInt(req.query.page, 10) || 1
    const publics = await Public.paginate({"text": { $regex : search, $options: 'i' } }, { limit, page, sort: { _id: -1 } })

    return res.status(200).json(publics)
}

cpublic.post = (req, res) => {

    console.log(req.body.text)
    // uploader 
    if (!req.body.file) {
        res.status(500).send({ msg: 'No se reconoce la imagen' })
        return
    }

    //res.status(200).send({ msg: 'Publicado' })
    cloudinary.uploader.upload(req.body.file, { public_id: req.user + "_" + Date.now() },
        function (err, result) {
            if (err) {
                res.status(500).send({ msg: 'Conflicto al subir la imagen' })
                console.log(err)
                return
            }

            // create public
            const mpublic = new Public({
                user: req.user,
                text: req.body.text,
                file: result.secure_url
            })

            // save public
            mpublic.save((err) => {
                if (err) res.status(500).send({ msg: `Error al publicar ${err}` })
                return res.status(201).send({ msg: 'Publicado' })
            })
        })
}

// id
cpublic.delet = async (req, res) => {
    await Public.findByIdAndDelete({ _id: req.params.id }, function (err, docs) {
        if (err) console.log(err)
        if (!err) res.status(200).send({ Deleted: docs })
    })
}

cpublic.put = async (req, res) => {

    // comment
    if (req.body.comment) {
        const comment = {
            user: req.user,
            comment: req.body.comment
        }

        await Public.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                $addToSet: {
                    comments: comment
                }
            }, function (err, docs) {
                if (err) res.status(500).send({ msg: 'error', docs: err })

                if (!err) res.status(200).send({ msg: 'comment', docs: docs })
            })
    } else {

        // like
        const like = {
            user: req.user
        }

        const mpublic = await Public.find({ _id: req.params.id }, "likes")

        let liked

        mpublic.map(e => {
            e.likes.map(e => {
                liked = e.user
            })
        })

        if (liked == req.user) {// remove
            await Public.findOneAndUpdate(
                {
                    _id: req.params.id,
                },
                {
                    $pull: {
                        likes: like
                    },
                }, function (err, docs) {
                    if (err) res.status(500).send({ msg: 'error', docs: err })

                    if (!err) res.status(200).send({ msg: 'deslike', docs: docs })
                })
            return
        } else {

            // save
            await Public.findOneAndUpdate(
                {
                    _id: req.params.id,
                },
                {
                    $addToSet: {
                        likes: like
                    },
                }, function (err, docs) {
                    if (err) { return res.status(500).send({ msg: 'error', docs: err }) }

                    if (!err) { return res.status(200).send({ msg: 'like', docs: docs }) }
                })
        }
    }
}

cpublic.gid = async (req, res) => {
    const mpublic = await Public.findOne({ _id: req.params.id })
    return res.status(200).send(mpublic)
}

// my
cpublic.gmy = async (req, res) => {
    const publics = await Public.find({ user: req.user }).sort({ _id: -1 }) //{sort:  } .sort('priority', 1);
    console.log("Sin contenido"+publics)
    return res.status(200).send({ data: publics })
}

// user/:id
cpublic.getUID = async (req, res) => {
    const publics = await Public.find({ user: req.params.id })
    return res.status(200).send({ data: publics })
}

// comments/:id
cpublic.getComments = async (req, res) => {
    const mpublic = await Public.findOne({ _id: req.params.id })
        .then(async p => {

            if (p.comments.length == 0)
                return res.status(200).send({ comments: [] })

            var i = 0
            var b = 0
            var comments = []
            p.comments.map(async com => {
                var data = {
                    index: i,
                    _id: com._id,
                    user: "",
                    comment: com.comment
                }
                i++
                await User.findOne({ _id: com.user })
                    .then(e => {
                        const user = {
                            _id: e._id,
                            name: e.name,
                            surname: e.surname,
                            avatar: e.avatar
                        }

                        data.user = user
                        comments.push(data)

                        if ((b + 1) == p.comments.length) {
                            comments.sort(function (a, b) {
                                return a.index - b.index;
                            })
                            console.log(comments)
                            return res.status(200).send({ comments: comments })
                        }
                        b++
                    })
            })
        })
}


module.exports = cpublic