const express = require('express')
const moment = require('moment')
const User = require('../models/User')
const Book = require('../models/Book')
const History = require('../models/History')
const expressAsyncHandler = require('express-async-handler')

const router = express.Router()

//책 조회하기
router.get('/book', expressAsyncHandler( async(req, res, next)=>{
    const books = await Book.find({})

    if(!books){
        res.status(404).json({code: 404, msg: '책 조회를 실패했습니다'})
    }else{
        res.json(books)
    }
    
}))

// 빌리기
router.post('/book', expressAsyncHandler( async(req, res, next) => {
    
    const book = await Book.findOne({ isbn : req.body.isbn })
    const user = await User.findOne({ _id : req.user._id })

    if(!book){
        return res.status(404).json({ code: 404, msg: '검색한 도서가 없습니다.'})
    }else{
        if(user.borrowedBook.includes(book._id)){
            return res.status(400).json({ code: 400, msg : ' 이미 대여한 책입니다.'})
        }else{
            user.borrowedBook.push(book._id)
            
            const log = new History({
                loanTime : moment(),
                deadLine : moment().add(14, 'days'),
                userId : user._id,
                bookId : book._id,
                work : '책 대여'
            })
            
            user.save()
            log.save()

            return res.json({ code: 200, msg: '대여 완료' })
        }
    }
}))

// 반납하기
router.delete('/book/:title', expressAsyncHandler( async(req, res, next) => {
    const book = await Book.findOne({ isbn : req.params.isbn })
    
    if(!book){
        return res.status(404).json({ code: 404, msg: '제목을 다시확인해 주세요.' })
    }else{
        await User.findOneAndUpdate(
            { _id : req.user._id},
            { $pull : { borrowedBook : book._id }}
        )

        const log = new History({
            returnTime : moment(),
            userId : req.user._id,
            bookId : book._id,
            work : '책 반납',
            isReturn : true
        })
        log.save()

        res.json({code: 200, msg : `${req.params.title}이 반납되었습니다.`})
    }

}))

// 대출 도서 목록 보기
router.get('/borrowed-book', expressAsyncHandler( async(req, res, next) => {
    const user = await User.findOne({ _id : req.user._id})

    const books = await Promise.all(user.borrowedBook.map(async bookId => {
        return Book.findOne( { _id : bookId } )
        .then(book => book)
    }))

    if(!user){
        res.status(401).json({ code: 401, msg: '아이디를 확인해 주세요'})
    }else{
        res.json(books)
    }

}))

// 대출 도서 상세 보기
router.get('/borrowed-book/:isbn', expressAsyncHandler( async(req, res, next) => {
    const user = await User.findOne({ _id: req.user._id })
    const book = await Book.findOne({ isbn: req.params.isbn })

    const history = await History.findOne({userId:req.user._id, bookId:book._id})

    let { loanTime, returnTime, deadLine, work, isReturn, end } = history
    loanTime = moment(loanTime).format('YYYY-MM-DD')
    returnTime = moment(returnTime).format('YYYY-MM-DD')
    deadLine = moment(deadLine).format('YYYY-MM-DD')

    if(!user){
        res.status(401).json({ code: 401, msg: '아이디를 확인해 주세요'})
    }else{
        
        res.json({loanTime, returnTime, deadLine, work, isReturn, end})
    }
}))

module.exports = router