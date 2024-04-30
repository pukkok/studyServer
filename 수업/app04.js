const express = require('express')
const app = express()
const port = 5500

const blockFirstUser = (req, res, next) => {
    if(req.params.name === 'kim'){
        res.status(401).send(`${req.params.name} are not authorized to this page!`)
    }else{
        next()
    }
}

const blockSecondUser = (req, res, next) => {
    if(req.params.name === 'park'){
        return res.status(401).send(`${req.params.name} are not authorized to this page!`)
    }
    next()
}

const allowThisUser = (req, res) => {
    res.send('you can see this home page!')
}

// app.get('/home/users/:name', 
//     blockFirstUser,
//     blockSecondUser,
//     allowThisUser
// ) // 둘다 가능
app.get('/home/users/:name', [
    blockFirstUser,
    blockSecondUser,
    allowThisUser
])


// 본인의 페이지일때
app.get('/users/:name/comments', 
(req, res, next) => {
    if(req.params.name !== 'pukkok'){ // 댓글 수정 권한 없음
        res.status(401).send('you are not authorized to this page!')
        // 상태 코드
    }else{
        next()
    }
},
(req, res) => {
    // 해당 사용자의 댓글 수정 페이지을 보여주기
    res.send('this is page to update your comments')
})

app.listen(port)