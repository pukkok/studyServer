const express = require('express')
const tester = express()
const port = 3005
const datas = require('../users.json')
const newDatas = JSON.parse(JSON.stringify(datas))

tester.get('/users', (req, res, next)=>{    
    let result = newDatas.map(({name, language : lang, bio}) => {
        return {name, lang, bio}
    })
    res.send(result)
})

tester.get('/req', (req, res, next)=>{
    res.send(...req)   
})

tester.get('/users/:keyword', (req, res, next)=> {
    let keyword = req.params.keyword
    let result = datas.filter(({name}) => {
        return name.includes(keyword)
    })
    result.length > 0 ? res.send(result) : next()
},
(req, res, next)=>{
    res.send('검색된 사용자가 없습니다.')
})

tester.get('/users/search/:id', (req, res, next)=>{
    if(req.params.id === 'LO6DVTZLRK68528I') res.send('관리자 페이지 입니다.')
    datas.forEach(({id}) => {
        if(req.params.id === id) res.send('권한이 없습니다.')
    })
    next()
},
(req, res, next)=>{
    throw new Error('server err')
})

tester.use((err, req, res, next)=>{
    console.log(err.stack) // 에러 위치 추적
    res.status(500).send('유저 없음')
})

tester.post('/users', (req, res)=>{
    let x = {name : '추가된 인원'}
    newDatas.unshift(x)
    res.send('총 몇명?'+ newDatas.length)
})

tester.listen(port)