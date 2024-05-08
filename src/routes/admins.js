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

router.post('/book', expressAsyncHandler( async(req, res, next) => {
    const book = new Book({
        title: req.body.title,
        release: req.body.release,
        author: req.body.author,
        summary : req.body.summary,
        isbn : req.body.isbn
    })

    const newBook = await book.save()

    if(!newBook){
        return res.status(400).json({ code: 400, msg : '책정보 입력이 잘못됐어요'})
    }else{
        const { title, summary, release, author } = newBook
        return res.json({
            code: 200,
            title, summary, release, author
        })
    }
}))

router.put('/book/:id', expressAsyncHandler( async(req, res, next) => {
    const book = await Book.findOne({ _id : req.params.id })

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

router.delete('/book/:id', expressAsyncHandler( async(req, res, next) => {
    const book = await Book.findByIdAndDelete({ _id: req.params.id })

    if(!book){
        res.status(404).json({ code: 404, msg: '없는 책이에요'})
    }else{
        res.status(204).json({ code: 204, msg: '삭제 완료'})
    }

}))

module.exports = router