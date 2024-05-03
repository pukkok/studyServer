const config = require('./config')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    return jwt.sign({ // 토큰 생성 페이로드
        _id:user._id,
        name: user.email,
        userId: user.userId,
        isAdmin: user.isAdmin,
        createAt: user.createAt
    },
    config.JWT_SECRET, // 비밀키
    {
        expiresIn: '1d', //토큰 만료 기간
        issuer: '눈높이'
    }
    )
}

const isAuth = (req, res, next) => {
    const bearerToken = req.headers.authorization // 요청헤더의 Authorization
    if(!bearerToken){
        return res.status(401).json({ msg : '토큰이 없어요'}) // 401 권한 없음
    }else{
        const token = bearerToken.slice(7, bearerToken.length)
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
            if(err && err.name === 'TokenExpiredError'){
                return res.status(419).json({ code: 419, msg: '토큰 만료입니다'})
            }else if(err){
                return res.status(401).json({ code: 401, msg: '유효한 토큰이 아니에요'})
            }
            req.user = userInfo
            next() // 권한이 있는 사용자의 서비스 허용
        })
    }
}

const isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else{
        return res.status(401)
        .json({ code: 401, msg: '당신은 관리자가 아니었습니다!'})
    }
}

module.exports = {
    generateToken,
    isAuth,
    isAdmin
}