const express = require('express')
const app = express()
const port = 5500

app.set('case sensitive routing', true) // url 대소문자 구분하는 설정

// body-parser 미들웨어 (아래처럼 사용하면 이제는 설치 안해도됨.)
app.use(express.json()) // 요청본문(request body)를 조회하기 위한 미들웨어

// '/users' 엔드포인트
app.get('/users', (req, res) => {
    // 데이터베이스에서 사용자의 전체 목록 조회
    res.send('all user list!')
})

app.post('/users', (req, res) => {
    console.log(req.body.newUser) // 브라우저에서 전송된 요청본문(request body) 조회

    res.json(`new user - ${req.body.newUser.name} created!`)
})

app.put('/users/:id', (req, res) => { 
    console.log(req.body.updatedUserInfo) // 데이터 베이스에서 id값에 해당하는 사용자 정보 조회후 업데이트 진행
    
    res.send(`user ${req.params.id} updated with payload ${JSON.stringify(req.body.updatedUserInfo)}`) // 객체는 json형식으로 풀어서 문자열로 바꿔야 나온다.
})

app.delete('/users/:id', (req, res) => {
    //데이터 베이스에서 id 값에 해당하는 사용자 조회후 제거
    res.send(`user ${req.params.id} removed!`)
})

app.listen(port, ()=>{
    console.log('port :', port)
})