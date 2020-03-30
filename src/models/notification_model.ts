export default function (sequelize: any, dataTypes: any): any {
    const notification = sequelize.define(
        'Notification',
        {
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
            body: {
                type: dataTypes.TEXT,
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
        },
        {
            tableName: 'notifications',
            freezeTableName: true,
            underscored: true,
            paranoid: true /** Soft deletes */
        }
    );

    notification.associate = (models: any): void => {
        notification.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
            as: 'user'
        });
    };

    return notification;
}
