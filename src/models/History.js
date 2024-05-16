const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose
const { Types : {ObjectId} } = Schema

const historySchema = new Schema({
    loanTime : {
        type : Date,
        default : moment()
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
        type : Date,
        default : moment().add(14, 'days')
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

historySchema.virtual('loanTimeFormat').get(function(){
    return moment(this.loanTime).locale('ko').format('LL')
})
historySchema.virtual('deadLineFormat').get(function(){
    return moment(this.deadLine).locale('ko').format('LL')
})
historySchema.virtual('returnTimeFormat').get(function(){
    if(this.returnTime) return moment(this.returnTime).locale('ko').format('LL')
    
})


const History = mongoose.model('History', historySchema)

module.exports = History