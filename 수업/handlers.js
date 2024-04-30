const express = require('express')
const router = express.Router()

// api 하위 url
router.get('/nunnoP', (req, res)=>{ // 라우터 레벨 미들웨어 함수
    res.send('제 이름은 nunnoP 입니다.')
})

router.get('/pukkok', (req, res)=> {
    res.send('제 이름은 pukkok 입니다.')
})
// router.use('/pukkok', file)

module.exports = router // 외부에서 router (하위 URL을 사용하기 위함)