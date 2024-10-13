const { Op } = require("sequelize")
const Users = require("../models/users.model")
const uuid = require("uuid")
const validator = require('validator')



const getAllUsers = async(q, order, offset, limit) => {
    const filter = {}
    if(q){
        filter[Op.or] = []
        if(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(q)){
            filter[Op.or].push({
                fullName : {
                    [Op.like]: `%${q}%`
                }
            })
        }

        filter[Op.or].push({
            email :  {
                [Op.like]: `%${validator.normalizeEmail(q)}%`
            }
        })
    }


    const users = await Users.findAndCountAll({
        distinct: true,
        where: filter,
        offset,
        limit
    })
    return users
}

const getUserById = async(id) => {
    return await Users.findByPk(id)
}

const createUser = async(data) => {
    const { firstName, lastName, email, birthdate } = data
    return await Users.create({
        id: uuid.v4(),
        firstName,
        lastName,
        email,
        birthdate
    })
}

const deleteUserById = async(id) => {
    await Users.destroy({
        where: {
            id
        }
    })
}

const updateUserById = async(id, data) => {
    const { firstName, lastName, email, birthdate } = data
    const user = await Users.findByPk(id)

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.email = email || user.email
    user.birthdate = birthdate || user.birthdate

    await user.save()
    return user
}

module.exports = {
    createUser,
    getAllUsers,
    deleteUserById,
    updateUserById,
    getUserById
}