const { DataTypes } = require("sequelize");
const db = require("../config/db");
const { user } = require("pg/lib/defaults");

const Users = db.define('Users', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
        validate: {
            isLowercase: true
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
        validate: {
            isLowercase: true
        }
    },
    fullName: {
        type: DataTypes.STRING,
        field: 'full_name',
        validate: {
            isLowercase: true
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'birth_date',
        validate: {
            isDate: true, // Verifica que sea una fecha válida
            isBeforeCurrentDate(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("The birthdate cannot be in the future");
                }
            }
        }
    }
})

Users.beforeCreate((user) => {
    user.firstName = user.firstName.toLowerCase()
    user.lastName = user.lastName.toLowerCase()
    user.fullName = `${user.firstName} ${user.lastName}`
    user.email = user.email.toLowerCase()
});

Users.beforeUpdate((user) => {
    user.firstName = user.firstName.toLowerCase()
    user.lastName = user.lastName.toLowerCase()
    user.email = user.email.toLowerCase()
    user.fullName = `${user.firstName} ${user.lastName}`
});

module.exports = Users