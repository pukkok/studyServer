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

// 통계 기록
router.get('/stat', expressAsyncHandler( async(req, res, next) => {
    const userLogs = await History.find({userId : req.user._id})
    .populate('bookId', ['category', '-_id'])
    const categories = {}

    userLogs.forEach(log => {
        const category = log.bookId.category
        if(categories[category]){
            categories[category]++
        }else{
            categories[category] = 1
        }
    })

    res.json(categories)
    
}))

module.exports = router