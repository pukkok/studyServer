const express = require('express') // 파일의 경로, 모듈 이름
const app = express() // app : 객체 : 서버 구현에 필요한 메서드, 멤버변수
const port = 6500 // http://127.0.0.1:6500/ or http://localhost:6500/
const apiHandler = require('./handlers')

// 공통 미들웨어는 라우터 미들웨어보다 위에 있는게 좋다. 요청끝나면 실행이 안되기 때문에
const myLogger = (req, res, next) => { // 미들웨어 함수 정의
    console.log('Logged')
    next() // 그 다음 미들웨어로 요청
    // 현재에선 requestTime 안의 콜백함수
}

//req, res는 객체다
const requestTime = (req, res, next) => {
    req.requestTime = Date.now() // 현재 시간에 대한 타임 스탬프
    console.log('로그 기록', new Date(req.requestTime))
    next()

    // Date.now() : 1970년도 이후부터 시간을 측정해서 밀리세컨즈로 계산한 값
}

app.use(myLogger, requestTime) // 서버에 미들웨어 함수 등록 - 공통 미들웨어

app.use((req, res, next)=>{ // get, post, delete, put 모든 HTTP 메서드에 대해서 실행
    console.log('Time :', Date.now())
    next()
})

// use 모든 요청 정보에 대해서 출력하는 미들웨어
app.use('/user/:id', (req, res, next)=>{ // 라우터가 일치할때 get, post, delete, put 모든 HTTP 메서드에 대해서 실행
    console.log('Request Type :', req.method) // req.method: http 요청 메서드 조회
    next()
},
(req, res, next)=> {
    console.log('URL :', req.url) // req.originalUrl : 사용자가 브라우저에서 접속한 URL 주소
    console.log('base URL :', req.baseUrl) // req.originalUrl : 사용자가 브라우저에서 접속한 URL 주소
    console.log('origin URL :', req.originalUrl) // req.originalUrl : 사용자가 브라우저에서 접속한 URL 주소
    next()
})

// get요청에 대해서만 출력
app.get('/user/:id', 
(req, res, next)=>{
    console.log('ID: ', req.params.id) // params.id = :id 부분의 값을 가져온다
    if(req.params.id === '관리자') next('route') // 같은 라우터 함수들 중에 바로 다음 route를 건너 뛴다.
    else next()
},
(req, res, next)=>{
    res.send({'USER Info' : req.params.id, 'msg' : '일반 사용자'}) // send(응답)를 하면 끝남, 응답 뒤에 next는 올수 없다
})

app.get('/user/:id', (req, res, next) => { // 위에서 응답을 끝냈기 때문에 종료
    res.send('두번째 동일한 요청: 관리자')
})

app.use('/api', apiHandler) // 하위 URL 등록

app.get('/error', (req, res, next)=>{
    throw new Error('서버 오류 발생') // 에러가 발생하면 모든 Route를 건너 뛰고 오류체크 미들웨어로 찾아감 (인자가 4개면 오류체크 미들웨어)
})

// app.get(라우트경로 = url 경로, 라우트 핸들러 = 콜백함수 = 미들웨어 함수)
// 라우트 미들웨어
app.get('/', (req, res)=>{ // req (요청), res(응답) : 객체
    let responseText = 'Hello World \n '
    responseText += '접속 시간: ' + new Date(req.requestTime)
    res.send(responseText)
}) // HTTP 메서드가 GET 방식인 경우

app.post('/', (req, res)=>{ // 데이터 생성
    res.send('Got a POST request')
})

app.put('/user', (req, res)=>{ // 데이터 수정할때
    res.send('Got a PUT request at /user')
})

app.delete('/user', (req, res)=>{ // 데이터 삭제
    res.send('Got a DELETE request /user')
})



app.use((err, req, res, next)=>{
    console.log(err.stack) // 에러 위치 추적
    res.status(400).send('something broken!')
})

app.listen(port, () => { // 브라우저에서 응답이 올때까지 대기
    console.log(`Example app listening on port ${port}`)
})

// METHOD : get, post, put, patch, delete (HTTP 메서드)
// app.get('/',(req, res) => {}, (req, res) => {}, (req, res) => {}) // 순서대로 콜백(핸들러) 실행