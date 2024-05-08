const express = require('express')
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
    
    const book = await Book.findOne({ title : req.body.title })
    const user = await User.findOne({ _id : req.user._id })

    if(!book){
        return res.status(404).json({ code: 404, msg: '검색한 도서가 없습니다.'})
    }else{
        if(user.borrowedBook.includes(book._id)){
            return res.json(' 이미 대여한 책입니다.')
        }else{
            user.borrowedBook.push(book._id)
            user.save()

            const log = new History({
                loanTime : new Date(),
                userId : user._id,
                bookId : book._id,
                work : '책 대여'
            })
            log.save()

            return res.json('대여 완료')
        }
    }
}))

// 반납하기
router.delete('/book/:title', expressAsyncHandler( async(req, res, next) => {
    const book = await Book.findOne({ title : req.params.title })
    
    if(!book){
        return res.status(404).json({ code: 404, msg: '제목을 다시확인해 주세요.' })
    }else{
        await User.findOneAndUpdate(
            { _id : req.user._id},
            { $pull : { borrowedBook : book._id }}
        )

        const log = new History({
            loanTime : new Date(),
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
        .then(book => book.title)
    })  
    )

    if(!user){
        res.status(401).json({ code: 401, msg: '아이디를 확인해 주세요'})
    }else{
        res.json({ '빌린책' : books.join(', ') })
    }

}))

// 대출 도서 상세 보기
router.get('/borrowed-book-detail', expressAsyncHandler( async(req, res, next) => {
    const user = await User.findOne({ _id: req.user._id })
    .populate('borrowedBook', ['-_id', 'title', 'release', 'summary', 'author'])

    if(!user){
        res.status(401).json({ code: 401, msg: '아이디를 확인해 주세요'})
    }else{
        const { borrowedBook } = user
        res.json({ '빌린책' : borrowedBook })
    }
}))

module.exports = router