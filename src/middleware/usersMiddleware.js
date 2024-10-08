const { body, validationResult } = require("express-validator")
const Users = require("../models/users.model")

const isValidUserId = async(req, res, next) => {
    const id = req.params.id
    try {
        const isValid = await Users.findByPk(id)
        if(!isValid){
            return res.status(400).json({
                status: 'error',
                message: 'invalid ID'
            })
        }
        next()
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

const validateUserData = (isRequired=false) => ([
    body('firstName')
        .optional(!isRequired)
        .notEmpty({ ignore_whitespace: true }).withMessage('firstName must be required').bail()
        .isString().withMessage('firstName must be a string').bail()
        .customSanitizer(value => value.replace(/\s+/g, ' ').trim())
        .isLength({ min: 3 }).withMessage('firstName must be at least 3 characters long.'),

    body('lastName')
        .optional(!isRequired)
        .notEmpty({ ignore_whitespace: true }).withMessage('lastName must be required').bail()
        .isString().withMessage('lastName must be a string').bail()
        .customSanitizer(value => value.replace(/\s+/g, ' ').trim())
        .isLength({ min: 3 }).withMessage('lastName must be at least 3 characters long.'),

    body('email')
        .optional(!isRequired)
        .notEmpty({ ignore_whitespace: true }).withMessage('email must be required').bail()
        .isString().withMessage('email must be a string').bail()
        .trim()
        .isEmail().withMessage('email must be in a valid format').bail()
        .normalizeEmail()
        .custom(async(value)=> {
            const duplicate = await Users.findOne({
                where: {
                    email: value
                }
            })
            if(duplicate && isRequired){
                throw new Error("email must be unique")
            }
            return true
        }),

    body('birthdate')
        .optional(!isRequired)
        .notEmpty({ ignore_whitespace: true }).withMessage('birthdate must be required').bail()
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('birthdate must be in YYYY-MM-DD format').bail()
        .custom(value => {
            const date = new Date(value);
            const [year, month, day] = value.split('-')
            if (
                date.getUTCFullYear() != year || 
                (date.getUTCMonth() + 1).toString().padStart(2, '0') != month || 
                date.getUTCDate().toString().padStart(2, '0') != day
            ){
                throw new Error("birthdate must be in YYYY-MM-DD format")
            }
            return true;
        }),

        (req, res, next) => {
            const result = validationResult(req)
            const errors = result.array().map(value => ({ param: value.location, message: value.msg, path: value.path }))
            if(!result.isEmpty()){
                return res.status(400).json({
                    status: 'error',
                    errors,
                })
            }
            next()
        }
    
])



module.exports = {
    isValidUserId,
    validateUserData
}