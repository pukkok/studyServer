const mongoose = require('mongoose')
const { Schema } = mongoose
const { Types : {ObjectId} } = Schema

const historySchema = new Schema({
    loanTime : {
        type : Date,
        require : false
    },
    returnTime : {
        type : Date,
        require : false
    },
    bookId : {
        type : ObjectId,
        ref : 'Book'
    },
    userId : {
        type : ObjectId,
        ref : 'User'
    },
    deadLine : {
        type : Date
    },
    isReturn : {
        type : Boolean,
        default : false
    },
    work : {
        type : String,
        require: true
    }
})

const History = mongoose.model('History', historySchema)

module.exports = History