const router = require('express').Router()
const { validateUserData, isValidUserId, validateUserFilter, checkPatchBodyNotEmpty } = require('../middleware/usersMiddleware')
const usersControllers = require('./usersControllers')


router.route('/')
    .get(validateUserFilter, usersControllers.getAll)
    .post(validateUserData(true), usersControllers.register)

router.route('/:id')
    .get( isValidUserId, usersControllers.getById)
    .patch( isValidUserId, checkPatchBodyNotEmpty, validateUserData(), usersControllers.update)
    .delete( isValidUserId, usersControllers.deleted)

exports.router = router
