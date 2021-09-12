const router = require('express').Router();
const { get, post, getOne, removeOne, patch, search } = require('../components/Products/products.controller');

router.route('/')
    .get(get)
    .post(post)

router.route('/search')
    .get(search)

router.route("/:id")
    .get(getOne)
    .delete(removeOne)
    .patch(patch)

module.exports = router