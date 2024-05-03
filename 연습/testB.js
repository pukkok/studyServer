const express = require('express')
const app = express()
const port = 2500
let books = {}

app.use('/users/:uname/books',(req, res, next)=>{
    req.user = {[req.params.uname] : []}
    next()
})

/** /users/:uname/books GET 현재 사용자의 전체 대출 도서목록 조회 */ 
app.get('/users/:uname/books', (req, res, next)=>{
    res.send(`${req.params.uname}의 도서목록 : ${books[req.params.uname].join(' , ')}`)
})

/** /users/:uname/books?book=해리포터 POST 현재 사용자의 도서목록에 특정 도서 추가 (쿼리스트링 값 조회) */
app.post('/users/:uname/books', (req, res, next)=>{
    const user = req.params.uname
    const book = req.query.book

    if(books[user]){
        if(books[user].includes(book)){
            books
        }else{
            books = {...books, [user] : [...books[user], book]}
        }
    }else{
        books = {...books, [user] : [book]}
    }

    res.send(JSON.stringify(books))
}
)
/** /users/:uname/books/:name GET 현재 사용자의 특정 도서 조회 */
app.get('/users/:uname/books/:name', (req, res, next)=>{

    let filteredBook = books[req.params.uname].filter(book=>{
        return book === req.params.name
    })

    res.send(`${req.params.uname}의 책 : ${filteredBook}`)

})

/** /users/:uname/books/:name?book=다빈치코드 PUT 현재 사용자의 특정 도서내용 변경 (변경사항을 쿼리스트링으로 입력) */
app.put('/users/:uname/books/:name', (req, res, next) => {
    const user = req.params.uname
    const name = req.params.name
    const newName = req.query.book
    if(books[user].includes(newName)) return res.send('이미 있어서 안돼')

    let changeBooks = books[user].map(book=>{    
        return book === name ? book = newName : book
    })
    books = {...books, [user] : [...changeBooks]}
    res.send(JSON.stringify(books))
})


/** /users/:uname/books/:name DELETE 현재 사용자의 특정 도서 삭제 */
app.delete('/users/:uname/books/:name', (req, res, next) =>{
    
    let deleteBooks = books[req.params.uname].filter(book=>{
        return book !== req.params.name
    })

    books = {...books, [req.params.uname] : [...deleteBooks]}

    res.send(JSON.stringify(books))
})

app.listen(port)