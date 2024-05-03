const express = require('express')
const app = express()
const port = 3535

/** cors 지정 */
const cors = require('cors')
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true 
}
app.use(cors(corsOptions))

/** DB 연동 */
const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/nunnoP'
mongoose.connect(DB_URL)
.then(()=> console.log('DB 연동 완료'))
.catch(err => console.log(`DB 연동 실패 : ${err}`))

/** 로그 기록 */
const logger = require('morgan')
app.use(logger('tiny'))

/** OPEN API 데이터 요청할때 */
// const axios = require('axios')
// app.get('/fetch', async (req, res) => {
//     const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
//     console.log(response)
//     res.send({todos : response.data}) // data객체 안으로 불러와 짐
// })

/** request body 파싱 미들웨어 */
app.use(express.json())

/** 시작 */
// const Book = require('./src/models/Book')
const User = require('../src/models/User')


app.get('/', (req, res)=>{
    res.send('어서와')
})

app.listen(port)