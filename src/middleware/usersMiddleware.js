const { body, query, validationResult, normalizeEmail } = require("express-validator")

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
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/).withMessage('firstName can only contain letters and spaces')

        .customSanitizer(value => value.replace(/\s+/g, ' ').trim().toLowerCase())
        .isLength({ min: 2, max: 50 }).withMessage('firstName must be between 2 and 50 characters')
        .escape(),

    body('lastName')
        .optional(!isRequired)
        .notEmpty({ ignore_whitespace: true }).withMessage('lastName must be required').bail()
        .isString().withMessage('lastName must be a string').bail()
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/).withMessage('lastName can only contain letters and spaces')

        .customSanitizer(value => value.replace(/\s+/g, ' ').trim().toLowerCase())
        .isLength({ min: 2, max: 100 }).withMessage('lastName must be between 2 and 100 characters')      
        .escape(),

    body('email')
        .optional(!isRequired)
        .notEmpty({ ignore_whitespace: true }).withMessage('email must be required').bail()
        .isString().withMessage('email must be a string').bail()
        .trim()
        .isEmail().withMessage('email must be in a valid format (example: user@domain.com)').bail()
        .normalizeEmail()
        .escape()
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
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('birthdate must be in a valid format (example: YYYY-MM-DD)').bail()
        .custom((value, { req } )=> {
            const date = new Date(value);
            const [year, month, day] = value.split('-')
            if (
                date.getUTCFullYear() != year || 
                (date.getUTCMonth() + 1).toString().padStart(2, '0') != month || 
                date.getUTCDate().toString().padStart(2, '0') != day
            ){
                throw new Error("birthdate must be in a valid format (example: YYYY-MM-DD)")
            }

            if(date > new Date()) {
                throw new Error("birthdate cannot be in the future");
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

const validateUserFilter = [
    query('q')
        .optional()
        .notEmpty({ ignore_whitespace: true }).withMessage('the parameter "q" cannot be empty or contain only spaces').bail()
        .isString().withMessage('the parameter "q" must not be duplicated').bail()
        .escape(),
    query('order')
        .optional()
        .notEmpty({ ignore_whitespace: true }).withMessage('the parameter "order" cannot be empty or contain only spaces').bail()
        .isString().withMessage('the parameter "order" must not be duplicated').bail()
        .toUpperCase()
        .isIn(['ASC', 'DESC']).withMessage('the "order" parameter only accepts the values ​​"ASC" or "DESC"'),
        
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
]


const checkPatchBodyNotEmpty = (req, res, next) => {
    const { firstName, lastName, email, birthdate } = req.body;
    // Verifica si el cuerpo está vacío o si no se proporciona ninguno de los campos esperados
    if (!firstName && !lastName && !email && !birthdate) {
        return res.status(400).json({ status: 'error', message: 'At least one field (firstName, lastName, email, birthdate) is required for update', errors: [
            { 
                msg: 'At least one field (firstName, lastName, email, birthdate) is required for update',
                location: "body"
            }
        ]})
    }
    next()
}


module.exports = {
    isValidUserId,
    validateUserData,
    validateUserFilter,
    checkPatchBodyNotEmpty
}