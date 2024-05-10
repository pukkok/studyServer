const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose
const { Types : {ObjectId} } = Schema

const historySchema = new Schema({
    loanTime : {
        type : Date
    },
    returnTime : {
        type : Date
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
        type : String
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

historySchema.virtual('end').get(function(){
    return moment(this.deadLine).locale('ko').fromNow()
})

const History = mongoose.model('History', historySchema)

module.exports = History