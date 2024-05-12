const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')
const { validationResult, oneOf } = require('express-validator')
const { validateUserName, validateUserEmail, validateUserPassword } = require('../../validator')

const router = express.Router()

// 회원가입
router.post('/register', [
    validateUserName(), // 함수 실행을 꼭해줘야한다!
    validateUserEmail(),
    validateUserPassword()
], expressAsyncHandler( async(req, res, next) => {
    const errs = validationResult(req)
    if(!errs.isEmpty()){
        res.status(400).json({
            code: 400,
            msg: '유효하지 않은 데이터입니다.',
            err: errs.array()
        })
    }else{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            userId: req.body.userId,
            password: req.body.password
        })

        try{
            const newUser = await user.save()
            const { name, email, userId, isAdmin, createdAt } = newUser
            res.json({
                code: 200,
                token: generateToken(newUser),
                name, email, userId, isAdmin, createdAt
            })

        }catch(err){
            if(err.code === 11000){
                return res.json({code: 11000, msg: '중복된 아이디입니다.'})
            }else{
                return res.status(400).json({ code: 400, msg: '데이터 입력을 잘못했어요', err})
            }
        }
    }

}))


// 로그인
router.post('/login', 
expressAsyncHandler( async(req, res, next) => {
    console.log(req.body)
    const loginUser = await User.findOne({
        userId: req.body.userId,
        password: req.body.password
    })
    if(!loginUser){
        res.status(401).json({ code: 401, msg: '아이디나 비밀번호를 확인해주세요'})
    }else{
        const { name, email, userId, isAdmin, createdAt } = loginUser
        res.json({
            code: 200,
            token: generateToken(loginUser),
            name, email, userId, isAdmin, createdAt
        })
    }
}))

// 로그아웃
router.post('/logout', (req, res, next) => {
    res.json('로그아웃')
})

// 수정
router.put('/', isAuth, oneOf([
    validateUserName(),
    validateUserEmail(),
    validateUserPassword()
], {message : '하나이상의 사용자필드를 수정해야 합니다.'}),
expressAsyncHandler( async(req, res, next) => {
    const errs = validationResult(req)

    if(!errs.isEmpty()){
        res.status(400).json({
            code: 400,
            msg: '유효하지 않은 데이터입니다.',
            err: errs.array()
        })
    }else{
        const user = await User.findById(req.user._id)

        if(!user){
            return res.status(404).json({ code: 404, msg: '유저를 찾을 수 없습니다'})
        }else{
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.password = req.body.password || user.password
    
            user.lastModifiedAt = new Date()
    
            const updatedUser = await user.save()
            const { name, email, userId, isAdmin, createdAt } = updatedUser
            return res.json({
                code: 200,
                token: generateToken(updatedUser),
                name, email, userId, isAdmin, createdAt
            })
        }
    }

}))

// 탈퇴
router.delete('/', isAuth,
expressAsyncHandler( async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.user._id)
    if(!user){
        res.status(404).json({ code: 404, msg: '유저를 찾을 수 없습니다.'})
    }else{
        res.status(204).json({ code: 204, msg: '삭제되었습니다.'})
        //204 no content
    }
})
)

module.exports = router

