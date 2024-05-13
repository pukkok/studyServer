const mongoose = require('mongoose')
const Book = require('./src/models/Book')
const config = require('./config')

const category = ['비문학', '소설', '문학', '자기계발', '요리', '패션', '여행']
const books = [] // 생성된 사용자 목록을 저장

mongoose.connect(config.MONGODB_URL) // 프로미스
.then(() => console.log('데이터베이스 연결 성공'))
.catch(err => console.log(`데이터베이스 연결 실패 : ${err}`))

// 랜덤날짜 생성
const generateRandomDate = (from, to) => { // from 시작하는 날짜, to 끝나는 날짜
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()))
}

// 배열에서 랜덤값 선택
const selectRandomValue = (arr) => {
    return arr[Math.floor(Math.random()*arr.length)]
}

const selectRandomNumber = (n, min=0) => {
    return Math.floor(Math.random()*(n-min))+min+1
}

// 랜덤 문자열 생성
const generateRandomeString = n => {
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    const str = new Array(n).fill('a')
    return str.map(s => alphabet[Math.floor(Math.random()*alphabet.length)]).join('')
}

const generateRandomeStringKR = n => {
    const kr = ['가','나','다','라','마','바','사','아','자','차','카','타','파','하']
    const str = new Array(n).fill('a')
    return str.map(s => kr[Math.floor(Math.random()*kr.length)]).join('')
}


//사용자 데이터 생성 테스트
const createBooks = async (n, books) => {
    console.log('creating Books now...')
    for(let i=0; i<n; i++){
        const book = new Book({
            title: generateRandomeStringKR(5),
            summary: `${generateRandomeString(100)}`,
            author: generateRandomeStringKR(3),
            release: `${selectRandomNumber(2024, 2000)}-${selectRandomNumber(12)}-${selectRandomNumber(30)}`,
            isbn: `978-13-${selectRandomNumber(99999, 10000)}-${selectRandomNumber(999, 100)}-${selectRandomNumber(9)}`,
            category: selectRandomValue(category)
        })
        books.push(await book.save())
    }
    return books
}


// 사용자와 해당 사용자의 할일 목록을 순서대로 생성
const buildData = async (books) => {
    books = await createBooks(7, books)
}

buildData(books)