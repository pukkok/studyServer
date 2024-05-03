const mongoose = require('mongoose')
const { Schema } = mongoose

const BookSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    summary : {
        type : String,
        required : false,
        default: ''
    },
    release : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    }
})

const Book = mongoose.model('Book', BookSchema)

module.exports = Book