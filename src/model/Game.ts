import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection';
import CategoryGames from './CategoryGames';
import Tag from './Tag';
import TagsGames from './TagsGames';

// order of InferAttributes & InferCreationAttributes is important.
class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
    // 'CreationOptional' is a special type that marks the field as optional
    // when creating an instance of the model (such as using Model.create()).
    declare id: CreationOptional<number>;
    declare name: string;
    declare url: string;
    declare description: string;
    declare thumbnail: string;
    declare gif_url: string;
    declare game_type: string;
}

export type {
    Game as GameType
}

export default Game.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: new DataTypes.STRING(150),
        allowNull: false
    },
    url: {
        type: new DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: new DataTypes.STRING(1500),
        allowNull: false
    },
    thumbnail: {
        type: new DataTypes.STRING(200),
        allowNull: false
    },
    gif_url: {
        type: new DataTypes.STRING(200),
        allowNull: false
    },
    game_type: {
        type: new DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: "tbl_games",
    sequelize: sequelize,
    timestamps: false
})

/* Game.hasMany(TagsGames, {
    as: "tags",
    foreignKey: "game_id"
}) */