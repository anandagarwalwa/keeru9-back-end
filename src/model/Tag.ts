import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection';

// order of InferAttributes & InferCreationAttributes is important.
class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
    // 'CreationOptional' is a special type that marks the field as optional
    // when creating an instance of the model (such as using Model.create()).
    declare id: CreationOptional<number>;
    declare name: string;
    declare color: string;
    declare creation_date: CreationOptional<string>;
    declare updated_date: CreationOptional<string>;
    declare status: CreationOptional<'A' | 'I' | 'D'>
}

export type {
    Tag as TagType
}


export default Tag.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: new DataTypes.STRING(45),
        allowNull: false
    },
    color: {
        type: new DataTypes.STRING(9),
        allowNull: false
    },
    creation_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: new DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'A',
        values: ['A', 'I', 'D']
    },
}, {
    tableName: "tbl_tags",
    sequelize: sequelize,
    updatedAt: "updated_date",
    createdAt: "creation_date"
})