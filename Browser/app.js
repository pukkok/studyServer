const BASE_URL = 'http://localhost:4002'

const login = async (userId, password) => {
    const userJSON = await fetch(`${BASE_URL}/api/users/login`, {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify({
           userId, password
        })
    })
    const user = await userJSON.json()
   return user
}

const register = async (name, email, userId, password, confrimPassword) => {
    const userJSON = await fetch(`${BASE_URL}/api/users/register`, {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify({
            name, email, userId, password, confrimPassword
        })
    })
    const user = await userJSON.json()
    return user
}

const book = async (title, summary, release, author, isbn, token) => {
    const bookJSON = await fetch(`${BASE_URL}/api/admins/book`, {
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        method : 'POST',
        body : JSON.stringify({
            title, summary, release, author, isbn
        })
    })
    const book = await bookJSON.json()
    alert('책 등록 완료')
    return book
}

// 로그인
const loginBtn = document.querySelector('.login-btn')
loginBtn.addEventListener('click', async (e)=>{
    // e.preventDefault()
    const idInput = document.getElementById('id')
    const pwInput = document.getElementById('pw')
    let x = await login(idInput.value, pwInput.value)
    if(x.token){
        localStorage.setItem('token', JSON.stringify(x.token))
        localStorage.setItem('admin', JSON.stringify(x.isAdmin))
        tokenCheck()
    }
})

// 회원가입 창열기
const registerBtn = document.querySelector('.register-btn')
const registerForm = document.querySelector('.register-form')
registerBtn.addEventListener('click', ()=>{
    registerForm.classList.toggle('on')
})

// 회원가입
const confirmBtn = registerForm.querySelector('button')
confirmBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const name = document.getElementById('r-name').value
    const email = document.getElementById('r-email').value
    const id = document.getElementById('r-id').value
    const pw = document.getElementById('r-pw').value
    const cpw = document.getElementById('r-cpw').value
    
    register(name, email, id, pw, cpw)
})

// 로그아웃
const logoutBtn = document.querySelector('.logout-btn')
logoutBtn.addEventListener('click', ()=>{
    localStorage.clear()
    tokenCheck()
})

// 로그인 상태
function tokenCheck () {
    const isToken = JSON.parse(localStorage.getItem('token'))
    const isAdmin = JSON.parse(localStorage.getItem('admin'))
    const isLoginTxt = document.querySelector('.isLogin')
    const isAdminTxt = document.querySelector('.isAdmin')
    if(isToken){
        isLoginTxt.innerText = '로그인 중'
    }else{
        isLoginTxt.innerText = '로그인 필요'
    }

    if(isAdmin){
        isAdminTxt.innerText = '맞음'
    }else{
        isAdminTxt.innerText = '아님'
    }

}

// 책 추가창 열기
const bookBtn = document.querySelector('.book-btn')
const addBook = document.querySelector('.add-book')
bookBtn.addEventListener('click', ()=>{
    const isAdmin = JSON.parse(localStorage.getItem('admin'))
    if(isAdmin){
        addBook.classList.toggle('on')
    }else{
        alert('관리자가 아니자나')
    }
})

// 책 추가
const addBookBtn = addBook.querySelector('button')
addBookBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const title = document.getElementById('title').value
    const summary = document.getElementById('summary').value
    const release = document.getElementById('release').value
    const author = document.getElementById('author').value
    const ISBN = document.getElementById('ISBN').value
    const token = JSON.parse(localStorage.getItem('token'))

    book(title, summary, release, author, ISBN, token)
})

const dataViewer = document.querySelector('.data-viewer')
// 책 조회
const bookCheckBtn =  document.querySelector('.book-check-btn')
bookCheckBtn.addEventListener('click', async () => {
    const token = JSON.parse(localStorage.getItem('token'))
    const books = await fetch(`${BASE_URL}/api/user-service/book`,{
        headers : {
            'Content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    })
    .then(res => res.json())
    
    dataViewer.innerHTML = ''
    const bookList = document.createElement('div')
    bookList.className='book-list'
    books.forEach((book, id) => {
        const div = document.createElement('div')
        div.className = `item${id+1}`
        const {title, summary, release, isbn, author} = book
        const h1 = document.createElement('h1')
        h1.innerText = title
        const p1 = document.createElement('p')
        p1.innerText = summary
        const p2 = document.createElement('p')
        p2.innerText = release
        const p3 = document.createElement('p')
        p3.innerText = isbn
        const p4 = document.createElement('p')
        p4.innerText = author
        const btn = document.createElement('button')
        btn.innerText = '책 대여'
        div.append(h1, p1, p2, p3, p4 , btn)
        bookList.append(div)
        btn.addEventListener('click', async ()=>{
                await fetch(`${BASE_URL}/api/user-service/book`, {
                    headers : {
                        'Content-type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    },
                    method : 'POST',
                    body : JSON.stringify({isbn})
                })
                .then(res => res.json())
                .then(result=>alert(result.msg))
        })
    })
    dataViewer.append(bookList)
})

//히스토리
const historyBtn = document.querySelector('.history-btn')
historyBtn.addEventListener('click', async ()=>{
    dataViewer.innerHTML = ''

    const token = JSON.parse(localStorage.getItem('token'))
    const history = document.createElement('div')
    history.className = 'history'
    let books = await fetch(`${BASE_URL}/api/user-service/borrowed-book`, {
        headers : {
            'Content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }).then(res => res.json())
    console.log(books)
    books.forEach((book)=>{
        const {title, author, isbn, summary, release} = book
        const div = document.createElement('div')
        const h4 = document.createElement('h4')
        h4.innerText = `제목: ${title}`
        const h5 = document.createElement('h5')
        h5.innerText = `저자: ${author}`
        const detailBtn = document.createElement('button')
        detailBtn.innerText = '상세보기'
        const returnBtn = document.createElement('button')
        returnBtn.innerText = '반납'
        div.append(h4, h5, detailBtn, returnBtn)
        history.append(div)

        detailBtn.addEventListener('click', async ()=>{
            let x = await fetch(`${BASE_URL}/api/user-service/borrowed-book/${isbn}`, {
                headers : {
                    'Content-type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                }
            }).then(res => res.json())
            console.log(x)
        })
    })
    dataViewer.append(history)
})

window.addEventListener('load', ()=>{
    tokenCheck()
})


