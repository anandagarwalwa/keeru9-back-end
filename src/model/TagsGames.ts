import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../config/dbConnection';
import Category, { CategoryType } from './Category';
import Game, { GameType } from './Game';
import Tag, { TagType } from './Tag';

class TagsGames extends Model<InferAttributes<TagsGames>, InferCreationAttributes<TagsGames>> {
    declare id: CreationOptional<number>;
    declare tag_id: ForeignKey<TagType['id']>;
    declare game_id: ForeignKey<GameType['id']>;
}

export type {
    TagsGames as TagsGamesType
}


export default TagsGames.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    tag_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Tag,
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
    tableName: "tbl_tags_games",
    sequelize: sequelize,
    timestamps: false
})


TagsGames.belongsTo(Game, {
    as: "game",
    foreignKey: 'game_id',
})

TagsGames.belongsTo(Tag, {
    as: "tag",
    foreignKey: 'tag_id',
})

Game.hasMany(TagsGames, { as: "tags", foreignKey: "game_id" })