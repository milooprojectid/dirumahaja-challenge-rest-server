'use strict';

const tableName = 'admins';

module.exports = {
    up: (queryInterface, dataTypes) => queryInterface.createTable(tableName, {
        id: {
            type: dataTypes.STRING,
            defaultValue: dataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: dataTypes.STRING(255),
            allowNull: true
        },
        email: {
            type: dataTypes.STRING(255),
            allowNull: true
        },
        username: {
            type: dataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        password: {
            type: dataTypes.STRING(255),
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
