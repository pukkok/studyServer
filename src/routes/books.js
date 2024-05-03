const express = require('express')
const User = require('../models/User')
const Book = require('../models/Book')
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')


const router = express.Router()


// 유저 확인
// 유저가 찾는 책 넣기
router.get('/book', expressAsyncHandler( async(req, res, next) => {
    const books = await Book.find({})

    if(!books){
        res.status(404).json({ code: 404, msg : '책 조회를 실패했습니다'})
    }else{
        const titles = books.map(book=> book.title)
        res.json(titles)
    }
}))

// 빌리기
router.post('/book', expressAsyncHandler( async(req, res, next) => {
    const book = await Book.find({ title : req.body.title })
    const user = await User.findOne({ _id : req.user._id })

    if(!book){
        res.status(404).json({ code: 404, msg: '일치하는 도서가 없습니다.'})
    }else{
        if(user.borrowedBook.includes(book)){
            return res.json(user)
        }else{
            user.borrowedBook.push(...book)
        }
        res.json(user)
    }
}))
// 반납하기
router.delete('/book', expressAsyncHandler( async(req, res, next) => {
    
}))

// 대출 도서 목록 보기
router.get('/book', expressAsyncHandler( async(req, res, next) => {
    
}))
// 대출 도서 상세 보기
router.get('/book', expressAsyncHandler( async(req, res, next) => {

}))

module.exports = router