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


window.addEventListener('load', ()=>{
    tokenCheck()
})


