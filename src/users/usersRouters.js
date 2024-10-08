const router = require('express').Router()
const { validateUserData, isValidUserId } = require('../middleware/usersMiddleware')
const usersControllers = require('./usersControllers')


router.route('/')
    .get(usersControllers.getAll)
    .post(validateUserData(true), usersControllers.register)

router.route('/:id')
    .get( isValidUserId, usersControllers.getById)
    .patch( isValidUserId, validateUserData(), usersControllers.update)
    .delete( isValidUserId, usersControllers.deleted)

exports.router = router
