const mongoose = require('mongoose')
const { Schema } = mongoose

let firstISBN = '000-00-00000-000-0'

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
    },
    isbn : {
        type: String,
        required : false,
        unique : true
    },
    category : {
        type: String,
        required : true
    }
})

const Book = mongoose.model('Book', BookSchema)

module.exports = Book