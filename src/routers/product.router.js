const router = require('express').Router();
const { read, create, readOne, remove, update, search } = require('../components/Products/products.controller');

router.route('/')
    .get(read) //? ✅
    .post(create) //? ✅

router.route('/search')
    .get(search)

router.route("/:id")
    .get(readOne)
    .delete(remove)
    .put(update)//? ✅

module.exports = router