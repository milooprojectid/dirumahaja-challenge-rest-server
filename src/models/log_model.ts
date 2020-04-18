export default function (sequelize: any, dataTypes: any): any {
    const log = sequelize.define(
        'Log',
        {
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
        },
        {
            tableName: 'logs',
            freezeTableName: true,
            underscored: true,
            paranoid: true /** Soft deletes */
        }
    );

    log.associate = (models: any): void => {
        log.belongsTo(models.Session, {
            foreignKey: 'session_id',
            targetKey: 'id',
            as: 'session'
        });
    };

    return log;
}
