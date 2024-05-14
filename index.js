const express = require('express')
const app = express()
const port = 4002
const schedule = require('node-schedule')
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const { limitUsage } = require('./trafficLimmiter')

const History = require('./src/models/History')
const User = require('./src/models/User')

const corsOptions = {
    origin: '*',
    credentials: true // 사용자 인증이 필요한 리소스를 요청할 수 있도록 허용함
}

const usersRouter = require('./src/routes/users')
const adminsRouter = require('./src/routes/admins')
const booksRouter = require('./src/routes/books')
const historyRouter = require('./src/routes/history')

const config = require('./config')
const { isAdmin, isAuth } = require('./auth')

mongoose.connect(config.MONGODB_URL) // 프로미스
.then(() => console.log('데이터베이스 연결 성공'))
.catch(err => console.log(`데이터베이스 연결 실패 : ${err}`))

/** 공통 미들웨어 */

app.use(cors(corsOptions)) // cors 설정 미들웨어
app.use(express.json()) // 파싱
app.use(logger('tiny')) // 로그 설정
/** ***************************************************************** */

/** 유저 로그인 */
app.use('/api/users', usersRouter)
/** 유저 도서 대출 서비스 */
app.use('/api/user-service', isAuth, booksRouter)
/** 1. 로그인 했는지? 2. 관리자인지? */
app.use('/api/admins',isAuth, isAdmin, adminsRouter)
/** 히스토리 */
app.use('/api/history', isAuth, historyRouter)

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

app.listen(port, async ()=>{
    
    schedule.scheduleJob('5 * 12 * * *', async ()=>{
        const logs = await History.find({})
        .populate('bookId', ['title','isbn', '-_id'])

        logs.forEach( async log => {
            
            let {userId, bookId} = log
            const now = new Date()
            if(log.deadLine < now){
                log.isReturn = true
                log.returnTime = now
                log.work = '반납'
                
                log.save()

                await User.findOneAndUpdate(
                    { _id : userId },
                    { $pull : { borrowedBook : bookId }}
                )
            }
        })
    })
    console.log(`${port}번 연결`)
})