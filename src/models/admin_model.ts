export default function (sequelize: any, dataTypes: any): any {
    const admin = sequelize.define(
        'Admin',
        {
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
            refresh_token: {
                type: dataTypes.STRING(255),
                allowNull: true
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
            tableName: 'admins',
            freezeTableName: true,
            underscored: true,
            paranoid: true /** Soft deletes */
        }
    );

    return admin;
}
