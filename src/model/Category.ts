import { Model, InferAttributes, InferCreationAttributes, CreationOptional,  DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection';
import CategoryGames from './CategoryGames';

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare creation_date: CreationOptional<string>;
    declare updated_date: CreationOptional<string>;
}

export type {
    Category as CategoryType
}

export default Category.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: new DataTypes.STRING(150),
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
}, {
    tableName: "game_category",
    sequelize: sequelize,
    updatedAt: "updated_date",
    createdAt: "creation_date"
})


Category.hasMany(CategoryGames, {
    as: "games",
    foreignKey: 'category_id'
})