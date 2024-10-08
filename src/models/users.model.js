const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Users = db.define('Users', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING(),
        allowNull: false,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING(),
        allowNull: false,
        field: 'last_name'
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
        type: DataTypes.DATE,
        allowNull: false,
        field: 'birth_date',
        validate: {
            isDate: true, // Verifica que sea una fecha válida
            isBeforeCurrentDate(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("La fecha de cumpleaños no puede ser en el futuro.");
                }
            }
        }
    }
})

module.exports = Users