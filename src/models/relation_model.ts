export default function (sequelize: any, dataTypes: any): any {
    const relation = sequelize.define(
        'Relation',
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
            challenger_id: {
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
        },
        {
            tableName: 'relations',
            freezeTableName: true,
            underscored: true,
            paranoid: true /** Soft deletes */
        }
    );

    relation.associate = (models: any): void => {
        relation.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
            as: 'owner'
        });
        relation.belongsTo(models.User, {
            foreignKey: 'challenger_id',
            targetKey: 'id',
            as: 'challenger'
        });
    };

    return relation;
}
