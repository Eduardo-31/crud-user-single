const Users = require("../models/users.model")
const uuid = require("uuid")



const getAllUsers = async() => {
    const users = await Users.findAndCountAll({
        distinct: true
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
    await Users.update({
        firstName,
        lastName,
        email,
        birthdate
    },{
        where: {
            id
        }
    })
}

module.exports = {
    createUser,
    getAllUsers,
    deleteUserById,
    updateUserById,
    getUserById
}