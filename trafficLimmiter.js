const expressRateLimit = require('express-rate-limit')

const limitUsage = expressRateLimit({
    windowMs : 60 * 1000, // ms기준
    max: 5, // 기준당 최대 사용횟수
    handler(req, res){
        res.status(429).json({
            code: 429,
            msg: '트래픽 허용량을 초과했습니다.'
        })
    }
})

module.exports = {
    limitUsage
}