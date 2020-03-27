'use strict';

const tableName = 'user_emblems';

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
            allowNull: false
        },
        emblem_code: {
            type: dataTypes.STRING(255),
            allowNull: false
        },
        is_active: {
            type: dataTypes.BOOLEAN,
            defaultValue: false
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
