const mongoose = require('mongoose')
const { Schema } = mongoose
const { Types : { ObjectId } } = Schema

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    lastModifiedAt : {
        type : Date,
        default : Date.now
    },
    borrowedBook : [
        { 
            type : ObjectId, 
            ref : 'Book'
        }
    ]
})

const User = mongoose.model('User', userSchema)

module.exports = User