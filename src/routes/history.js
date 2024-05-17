const express = require('express')
const History = require('../models/History')
const expressAsyncHandler = require('express-async-handler')

const router = express.Router()

router.get('/log', expressAsyncHandler( async(req, res, next) => {
    const log = await History.find({userId : req.user._id})
    .populate('userId', ['name', '-_id'])
    .populate('bookId', ['title','isbn', '-_id'])

    const mappingLog = log.map(x=> {
        let {_id, bookId, deadLineFormat, isReturn, loanTimeFormat, returnTimeFormat, work, end} = x
        const { title, isbn } = bookId
        return {_id, title, isbn, deadLineFormat, isReturn, loanTimeFormat, returnTimeFormat, work, end}
    })
    res.json( mappingLog )
}))

module.exports = router