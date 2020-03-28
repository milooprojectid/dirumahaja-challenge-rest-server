export default function (sequelize: any, dataTypes: any): any {
    const userEmblem = sequelize.define(
        'UserEmblem',
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
        },
        {
            tableName: 'user_emblems',
            freezeTableName: true,
            underscored: true,
            paranoid: true /** Soft deletes */
        }
    );

    userEmblem.associate = (models: any): void => {
        userEmblem.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
            as: 'user'
        });
        userEmblem.belongsTo(models.Emblem, {
            foreignKey: 'emblem_code',
            targetKey: 'code',
            as: 'emblem'
        });
    };

    return userEmblem;
}
