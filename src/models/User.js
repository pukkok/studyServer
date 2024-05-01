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
        // unique : true
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

const Book = require('./Book')
console.log(Book)

const user = new User({
    name: '눈높이',
    email: 'np@gmail.com',
    userId: 'nunnoP',
    password: '123123123',
    borrowedBook : ['1번책', '2번책']
})

user.save()
// .then(()=>console.log('회원가입 성공'))