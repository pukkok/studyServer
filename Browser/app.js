const BASE_URL = 'http://localhost:4000'

const login = async (id, pw) => {
    const userJSON = await fetch(`${BASE_URL}/api/users/login`, {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify({
            id, pw
        })
    })
    console.log(userJSON.json().token)
    return userJSON.json()
}

const idInput = document.getElementById('id')
const pwInput = document.getElementById('pw')
const loginBtn = document.querySelector('.login-btn')

const register = document.querySelector('.register')

loginBtn.addEventListener('click', ()=>{
    login(idInput.value, pwInput.value)
})

register.addEventListener('click', ()=> {
    
})

// const getGroup = async (field, token) => {
//     const groupJSON = await fetch(`${BASE_URL}/api/`)
// }
