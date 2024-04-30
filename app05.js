const express = require('express')
const app = express()
const port = 5500

// 쿼리스트링 : 브라우저의 URL 주소로 서버에 데이터를 전송할 때 사용
// 간단한 데이터, 검색어, 페이지번호, 정렬
app.get('/shirts', (req, res) => {
    res.send(`특징 - 색상: ${req.query.color} / 크기: ${req.query.size}`)
})

app.get('/hello', (req, res) => {
    //res.json() 제이슨 파일로 전달 가능
    //res.send() 제이슨 형식으로 보내면 제이슨 파일로 보여줌
    res.send(`
        <html>
            <head></head>
            <body>
                <h1>Hello World!</h1>
                <input type='button' value='submit'/>
            </body>
        </html>
    `)
})

app.get('/google', (req, res) => {
    res.redirect('https://google.com')
})

// 같은 url 이지만 서로다른 로직을 처리할 수 있다.
app.get('/chance', (req, res, next) => {
    if(Math.random() < .5) return next()
    res.send('first one')
})
app.get('/chance', (req, res, next) => {
    res.send('second one')
})

app.get('/fruits/:name',
(req, res, next)=>{
    if(req.params.name !== 'apple') return next()
    res.send('[logic 1] you choose apple for your favorite fruit!')
},
(req, res, next)=>{
    if(req.params.name !=='banana') return next()
    res.send('[logic 2] you choose banana for your favorite fruit!')
},
(req, res)=>{
    res.send(`[logic 3] you choose ${req.params.name} for your favorite fruit!`)
})


app.listen(port)

// 캐싱을 한다면 status 304
// 캐싱 : 서버에 기록을 해놓고 이미 불러왔던 데이터라면 이전 데이터를 사용함
// 캐싱 없다면 status 200
// 불러올때마다 새로 불러옴