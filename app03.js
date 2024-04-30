const express = require('express')
const app = express()
const port = 5500


app.get('/go+gle', (req, res) => { // go와 gle 사이에 o가 여러개 있어도 가능 gogle, google, goooooogle
    res.send('google site')
})

app.get('/sylee((mo)+)?', (req, res) => { //sylee 옵션 x 값 syleemo , syleemomo, syleemomomo 다 가능
    res.send(`sylee is definitely shown! and other string is optional!`)
})

// app.get(/^\/users\/(\d{4})\/sun\/(\d{3}$)/, (req, res) => { // /users/1234, /users/4040
//     console.log(req.params)

//     //(\d{4}) 첫번째 params 객체 (\d{3}$) 두번째 params 객체
//     // res.send(`user id ${JSON.stringify(req.params)} found successfully!`) // 아무것도 안들어가 있을때는 {"0" : "dddd"} 로 들어간다.
//     res.send(`user id ${req.params[0]} ${req.params[1]} found successfully!`)
// })

app.get('/users/:userId([0-9]{4})', (req, res) => {
    console.log(req.params)
    res.send(`user id ${req.params.userId} found successfully!`)
})

app.get('/users/contact', (req, res) => {
    res.send('contact page!')
})
app.get('/users/city', (req, res) => {
    res.send('city apge!')
})
app.get('/users*', (req, res) => {
    res.send('users wildcards!')
})



app.listen(port)