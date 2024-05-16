const express = require('express')
const User = require('../models/User')
const Book = require('../models/Book')
const expressAsyncHandler = require('express-async-handler')
// const { generateToken, isAuth } = require('../../auth')

const router = express.Router()

// 신간도서 추가 post
// 기존도서 삭제 del
// 기존도서 정보 변경 put
// 도서목록 조회 get
// 책 추가하기
router.post('/book', expressAsyncHandler( async(req, res, next) => {
    const book = new Book({
        title: req.body.title,
        release: req.body.release,
        author: req.body.author,
        summary : req.body.summary,
        isbn : req.body.isbn,
        category : req.body.category
    })

    try{
        const newBook = await book.save()
        
        const { title, summary, release, author, isbn, category } = newBook
        return res.json({
            code: 200,
            title, summary, release, author, isbn, category,
            msg : '도서 등록 완료'
        })
    }catch(err){
        if(err.code === 11000){
            return res.json({ code: 11000, msg: 'isbn 중복'})
        }else{
            return res.status(400).json({ code: 400, msg : '책정보 입력이 잘못됐어요'})
        }
    }
    
}))

// 책 내용 수정하기
router.put('/book/:isbn', expressAsyncHandler( async(req, res, next) => {
    console.log(req.params.isbn)
    const book = await Book.findOne({ isbn : req.params.isbn })

    if(!book){
        res.status(404).json({ code: 404, msg: '없는 책이에요'})
    }else{
        book.title = req.body.title || book.title,
        book.summary = req.body.summary || book.summary
        book.release = req.body.release || book.release
        book.author = req.body.author || book.author

        const updatedBook = await book.save()
        return res.json({
            code: 200,
            msg: '책 변경 완료',
            updatedBook
        })
    }
}))

// 책 삭제하기
router.delete('/book/:isbn', expressAsyncHandler( async(req, res, next) => {
    const book = await Book.findOneAndDelete({ isbn: req.params.isbn })

    if(!book){  
        res.status(404).json({ code: 404, msg: '없는 책이에요'})
    }else{
        // res.status(204).json({ code: 204, msg: '삭제 완료'})
        res.json({ code: 204, msg: '삭제 완료'})
    }

}))

module.exports = router