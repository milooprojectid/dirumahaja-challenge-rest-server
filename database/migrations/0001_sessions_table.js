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
        user_id: {
            type: dataTypes.STRING(255),
            allowNull: false,
        },
        health: {
            type: dataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        status: {
            type: dataTypes.INTEGER,
            defaultValue: 20,
            allowNull: false
        },
        days: {
            type: dataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        next_log: {
            type: dataTypes.DATE,
            allowNull: true
        },
        start_time: {
            type: dataTypes.DATE,
            allowNull: false
        },
        end_time: {
            type: dataTypes.DATE,
            allowNull: true
        },
        punishment: {
            type: dataTypes.TEXT,
            allowNull: true,
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
