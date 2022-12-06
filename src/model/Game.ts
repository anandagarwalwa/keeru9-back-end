import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, DataTypes, NonAttribute } from 'sequelize';
import sequelize from '../config/dbConnection';
import Category from './Category';
import CategoryGames from './CategoryGames';
import Tag, { TagType } from './Tag';
import TagsGames, { TagsGamesType } from './TagsGames';

// order of InferAttributes & InferCreationAttributes is important.
class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
    // 'CreationOptional' is a special type that marks the field as optional
    // when creating an instance of the model (such as using Model.create()).
    declare id: CreationOptional<number>;
    declare name: string;
    declare url: string;
    declare description: string;
    declare thumbnail: string;
    declare featured: boolean;
    declare popular: boolean;
    declare top_rated: boolean;
    declare gif_url: string;
    declare game_type: string;
    declare height: number;
    declare width: number;
    declare creation_date: CreationOptional<string>;
    declare updated_date: CreationOptional<string>;

    declare tags: NonAttribute<TagsGamesType[]>;
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
        type: DataTypes.TEXT,
        allowNull: false
    },
    thumbnail: {
        type: new DataTypes.STRING(200),
        allowNull: false
    },
    featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    popular: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    top_rated: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    gif_url: {
        type: new DataTypes.STRING(200),
        allowNull: false
    },
    game_type: {
        type: new DataTypes.STRING(20),
        allowNull: false
    },
    height: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    width: {
        type: DataTypes.INTEGER.UNSIGNED,
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
    tableName: "tbl_games",
    sequelize: sequelize,
    updatedAt: "updated_date",
    createdAt: "creation_date"
})

/* Game.hasMany(TagsGames, {
    as: "tags",
    foreignKey: "game_id"
}) */