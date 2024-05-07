const express = require('express')
const User = require('../models/User')
const Book = require('../models/Book')
const History = require('../models/History')
const expressAsyncHandler = require('express-async-handler')

const router = express.Router()


router.get('/log', expressAsyncHandler( async(req, res, next) => {
    const log = await History.find({})
    .populate('userId', ['name', '-_id'])
    .populate('bookId', ['title', '-_id'])

    // log.map()
    console.log(log)

    res.json({'로그' : log })
}))

module.exports = router