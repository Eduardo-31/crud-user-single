const { createUser, getAllUsers, getUserById, deleteUserById, updateUserById } = require("./usersServices")

const getAll = async(req, res) => {
    try {
        const {count, rows} = await getAllUsers()

        return res.status(200).json({
            status: 'success',
            count,
            users: rows
        })
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

const getById = async(req, res) => {
    const id = req.params.id
    try {
        const user = await getUserById(id)
        return res.status(200).json({
            status: 'success',
            user
        })
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

const register = async(req, res) => {
    const data = req.body
    try {
        const user  = await createUser(data)
        return res.status(201).json({
            status: 'success',
            message: 'user created successfully',
            user
        })
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

const update = async(req, res) => {
    const id = req.params.id
    const data = req.body
    try {
        const user  = await updateUserById(id,data)
        return res.status(200).json({
            status: 'success',
            message: 'user is updated successfully',
            user
        })
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

const deleted = async(req, res) => {
    const id = req.params.id
    try {
        await deleteUserById(id)
        return res.status(204).json({
            status: 'success',
            message: 'user deleted successfully'
        })
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}


module.exports = {
    getAll,
    getById,
    register,
    update,
    deleted
}