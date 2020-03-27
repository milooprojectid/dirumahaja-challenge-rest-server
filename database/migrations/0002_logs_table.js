'use strict';

const tableName = 'sessions';

module.exports = {
    up: (queryInterface, dataTypes) => queryInterface.createTable(tableName, {
        id: {
            type: dataTypes.STRING,
            defaultValue: dataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        session_id: {
            type: dataTypes.STRING(255),
            allowNull: false
        },
        coordinate: {
            type: dataTypes.GEOMETRY('POINT'),
            allowNull: false
        },
        status: {
            type: dataTypes.INTEGER,
            defaultValue: 20,
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
