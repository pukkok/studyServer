const express = require('express')
const app = express()
const port = 4000

const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')


const usersRouter = require('./src/routes/users')
const adminsRouter = require('./src/routes/admins')
const booksRouter = require('./src/routes/books')
const config = require('./config')
const { isAdmin, isAuth } = require('./auth')

mongoose.connect(config.MONGODB_URL) // 프로미스
.then(() => console.log('데이터베이스 연결 성공'))
.catch(err => console.log(`데이터베이스 연결 실패 : ${err}`))

/** 공통 미들웨어 */
app.use(express.json()) // 파싱
app.use(logger('tiny')) // 로그 설정
/** ***************************************************************** */

app.use('/api/users', usersRouter)
app.use('/api/user-service', isAuth, booksRouter)
/** 1. 로그인 했는지? 2. 관리자인지? */
app.use('/api/admins',isAuth, isAdmin, adminsRouter)


app.use('/', (req, res, next)=>{
    res.json('시작페이지')
})

app.use((req, res, next)=>{
    res.status(404).json('페이지를 찾을 수 없습니다.')
})

app.use((err, req, res, next)=>{
    console.log(err.stack)
    res.status(500).json('서버 에러 발생!')
})

app.listen(port, ()=>{
    console.log(`${port}번 연결`)
})