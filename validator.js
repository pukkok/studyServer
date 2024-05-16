const { body } = require('express-validator')

const isFieldEmpty = (field) => {
    return body(field)
            .notEmpty() // 필드가 비어있지 않다.
            .withMessage(`${field} 부분이 비었습니다.`)
            .bail() // 끊기
            .trim() // 공백제거
}

const validateUserName = () => {
    return isFieldEmpty('name')
            .isLength({ min: 2, max: 20 }) //회원명 2~20자
            .withMessage('회원명은 2자에서 20자 사이로 입력해주세요')
}

const validateUserId = () => {
    return isFieldEmpty('userId')
            .isLength({ min: 2, max: 20 }) //회원명 2~20자
            .withMessage('회원명은 2자에서 20자 사이로 입력해주세요')
}

const validateUserEmail = () => {
    return isFieldEmpty('email')
            .isEmail() // 이메일 형식 검사(내장 메서드)
            .withMessage('이메일 형식이 올바르지 않습니다.')
}

const validateUserPassword = () => {
    return isFieldEmpty('password')
            .isLength({ min: 7 })
            .withMessage('7자 이상으로 입력해주세요')
            .isLength({ max : 15 })
            .withMessage('15자 이하로 입력해주세요')
            .bail()
            .matches(/[a-zA-Z]/)
            .withMessage('알파벳 1자 이상이 필요합니다.')
            .matches(/[0-9]/)
            .withMessage('숫자 1개 이상이 필요합니다.')
            .matches(/[!@#$%^&*]/)
            .withMessage('특수문자 1자 이상이 필요합니다.')
            .bail()
            .custom((value, {req}) => {
                return req.body.confirmPassword === value
            })
            .withMessage('패스워드가 일치하지 않습니다.')
}

module.exports = ({
    validateUserName,
    validateUserEmail,
    validateUserPassword
})