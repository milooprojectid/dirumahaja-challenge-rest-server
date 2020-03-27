'use strict';

const tableName = 'users';

module.exports = {
    up: (queryInterface, dataTypes) => queryInterface.createTable(tableName, {
        id: {
            type: dataTypes.STRING,
            defaultValue: dataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: dataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        age: {
            type: dataTypes.INTEGER,
            allowNull: true
        },
        gender: {
            type: dataTypes.ENUM('f', 'm'),
            allowNull: true
        },
        coordinate: {
            type: dataTypes.GEOMETRY('POINT'),
            allowNull: false
        },
        created_at: {
            type: dataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: dataTypes.DATE,
            allowNull: true
        },
        deleted_at: {
            type: dataTypes.DATE,
            allowNull: true
        }
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable(tableName)
};
