import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../config/dbConnection';
import Category, { CategoryType } from './Category';
import Game, { GameType } from './Game';

class CategoryGames extends Model<InferAttributes<CategoryGames>, InferCreationAttributes<CategoryGames>> {
    declare id: CreationOptional<number>;
    declare category_id: ForeignKey<CategoryType['id']>;
    declare game_id: ForeignKey<GameType['id']>;
}

export type {
    CategoryGames as CategoryGamesType
}


export default CategoryGames.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Category,
            key: "id"
        }
    },
    game_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Game,
            key: "id"
        }
    },
}, {
    tableName: "tbl_category_games",
    sequelize: sequelize,
    updatedAt: "updated_date",
    createdAt: "creation_date"
})


CategoryGames.belongsTo(Game, {
    as: "game",
    foreignKey: 'game_id',
})
