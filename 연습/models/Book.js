const mongoose = require('mongoose')
const { Schema } = mongoose

const BookSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    summary : {
        type : String,
        required : false
    },
    release : {
        type : String,
        required : false
    },
    author : {
        type : String,
        required : false
    }
})

const Book = mongoose.model('Book', BookSchema)

module.exports = Book

const book = new Book({
    title : '해리포터',
    author : '조앤 케이 롤링'
})

book.save().then(()=>console.log('북 등록'))