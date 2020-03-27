'use strict';

const tableName = 'punishments';

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
            allowNull: false
        },
        text: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        img_url: {
            type: dataTypes.STRING(255),
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
