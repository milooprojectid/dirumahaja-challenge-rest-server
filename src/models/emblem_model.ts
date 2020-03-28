export default function (sequelize: any, dataTypes: any): any {
    const emblem = sequelize.define(
        'Emblem',
        {
            id: {
                type: dataTypes.STRING,
                defaultValue: dataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            code: {
                type: dataTypes.STRING(255),
                allowNull: false
            },
            name: {
                type: dataTypes.STRING(255),
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
        },
        {
            tableName: 'emblems',
            freezeTableName: true,
            underscored: true,
            paranoid: true /** Soft deletes */
        }
    );

    return emblem;
}
