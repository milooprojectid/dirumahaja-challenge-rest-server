export default function(sequelize: any, dataTypes: any): any {
    const member = sequelize.define(
        'User',
        {
            id: {
                type: dataTypes.STRING,
                defaultValue: dataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: dataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            age: {
                type: dataTypes.INTEGER,
                allowNull: true
            },
            gender: {
                type: dataTypes.ENUM('f', 'm'),
                allowNull: true
            },
            coordinate: {
                type: dataTypes.GEOMETRY('POINT'),
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
            tableName: 'users',
            freezeTableName: true,
            underscored: true,
            paranoid: true /** Soft deletes */
        }
    );

    member.associate = (models: any): void => {
        // Member.belongsTo(models.model_name, {
        //     foreignKey: 'model_name_id',
        //     targetKey: 'id'
        // });
    };

    return member;
}
