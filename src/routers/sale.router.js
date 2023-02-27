const router = require('express').Router();
const { read, create, readOne, remove, update } = require('../components/Sale/sale.controller');

router.route('/')
    .get(read) //? ✅
    .post(create) //? ✅

router.route("/:id")
    .get(readOne)
    .delete(remove)
    .put(update)//? ✅

module.exports = router