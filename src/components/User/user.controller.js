const { jsonResponse } = require('../../lib/jsonresponse');
const User = require('./user.model');
const user = {};

user.create = (req, res) => {
    // const { body } = req

    console.log('On create')

    // const nUser = new User(body);
    // await nUser.save((err, doc) => {
    //     if (err) return res.json(jsonResponse(500, { msg: err }))

    //     return res.json(jsonResponse(200, { data: doc }))
    // })
    return res.json(jsonResponse(200, { data: 'holaa' }))
}

user.update = (req, res) => {
    const options = { new: true };
    const { body, params: { id } } = req;

    User.findOneAndUpdate({ cod: id }, body, options, (err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200, { data: doc }))
    })
}

user.remove = (req, res) => {
    const { id } = req.params;

    User.findOneAndDelete({ cod: id }, (err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200, { data: doc }))
    })
}

user.readOne = (req, res) => {
    const { id } = req.params;

    User.findOne({ cod: id }, (err, doc) => {
        if (err) return res.json(jsonResponse(500, { msg: err }))

        return res.json(jsonResponse(200,{ data: doc }))
    })
}

user.read = async (req, res) => {
    const result = await User.find({}); 

    if (!result) return res.json(jsonResponse(500, { msg: 'Error' }))

    res.json(jsonResponse(200, { data: result }))
}

module.exports = user