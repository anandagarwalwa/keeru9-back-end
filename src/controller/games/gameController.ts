import e from "cors";
import { Request, Response } from "express";
import { Op } from 'sequelize';
import sequelize from "../../config/dbConnection";
import { ICreateGameReq, IGameDetailParam, ISearchGamesQuery } from "../../dto/games";
import Category from "../../model/Category";
import CategoryGames from "../../model/CategoryGames";
import Game from "../../model/Game";
import Tag from "../../model/Tag";
import TagsGames from "../../model/TagsGames";

export async function gameList(req: Request<any, any, any, any>, res: Response) {
    res.status(200).json(await Game.findAll())
}

export async function featuredGameList(req: Request<any, any, any, any>, res: Response) {
    res.status(200).json(await Game.findAll({
        where: {
            featured: true
        }
    }))
}

export async function popularGameList(req: Request<any, any, any, any>, res: Response) {
    res.status(200).json(await Game.findAll({
        where: {
            popular: true
        }
    }))
}

export async function createGame(req: Request<any, any, ICreateGameReq>, res: Response) {
    const transaction = await sequelize.transaction();
    try {
        const gameResponse = await Game.create(req.body, { transaction });

        if (gameResponse) {
            const addCatGames = await CategoryGames.create({
                category_id: req.body.category_id,
                game_id: gameResponse.id,
            }, { transaction })

            const tags = await TagsGames.bulkCreate(req.body.tags.map(e => {
                return {
                    tag_id: e,
                    game_id: gameResponse.id
                }
            }), { transaction })

            await transaction.commit();
            return res.status(200).json(gameResponse.toJSON())
        } else {
            await transaction.rollback();
            res.status(500).send({ error: "Unable to create game right now." })
        }
    } catch (error) {
        await transaction.rollback();
        res.status(500).send({ error })
    }
}

// get game detail api/games/1
export async function getGameDetail(req: Request<IGameDetailParam>, res: Response) {
    const response = await Game.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: TagsGames,
                as: "tags",
                required: false,
                include: [
                    {
                        model: Tag,
                        as: "tag",
                        required: false
                    }
                ]
            },
            {
                model: CategoryGames,
                as: 'category',
            }
        ]
    })

    if (response) {
        const tagIds = response.tags.map(e => e.tag_id)
        const tagGames = await TagsGames.findAll({
            where: {
                tag_id: {
                    [Op.in]: tagIds
                }
            },
            include: [
                {
                    model: Game,
                    as: "game",
                }
            ]
        })

        var initialGameId = -1
        res.status(200).json({
            ...response.dataValues, similar_games: tagGames.map(e => {
                return e.game.dataValues
            }).filter(ele => {
                console.log(response.id, ele.id);
                
                if (ele.id != initialGameId) {
                    initialGameId = ele.id
                    return response.id !== ele.id
                }
                return false
            })
        })
    } else {
        res.status(404).json({
            error: "Game not found"
        })
    }
}

export async function searchGameList(req: Request<any, any, any, ISearchGamesQuery>, res: Response) {
    res.status(200).json(await Game.findAll({
        where: {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${req.query.q}%`
                    },
                },
                {
                    description: {
                        [Op.like]: `%${req.query.q}%`
                    }
                }
            ]
        }
    }))
}

export async function deleteGame(req: Request<IGameDetailParam>, res: Response) {
    try {
        const response = await Game.findByPk(req.params.id)

        if (response) {
            await response.destroy()
            return res.status(200).json(response.dataValues)
        } else {
            return res.status(404).json({
                error: "Record not found"
            })
        }


    } catch (error) {
        res.status(500).send({ error })
    }
}

export async function updateGame(req: Request<IGameDetailParam, any, ICreateGameReq>, res: Response) {
    try {
        const response = await Game.findByPk(req.params.id)

        if (response) {
            response.set(req.body)
            const updatedGame = await response.save()

            const foundCategory = await CategoryGames.findOne({
                where: {
                    game_id: response.id,
                }
            })

            if (foundCategory) {
                foundCategory.set({
                    category_id: req.body.category_id
                })

                foundCategory.save();

                await TagsGames.destroy({
                    where: {
                        game_id: req.params.id
                    }
                })

                await TagsGames.bulkCreate(req.body.tags.map(e => {
                    return {
                        tag_id: e,
                        game_id: response.id
                    }
                }))

                /* const shouldDestroy = foundTags.filter(e => !req.body.tags.includes(e.tag_id))

                await Promise.all(shouldDestroy.map(e => e.destroy())) */

                return res.status(200).json(updatedGame.dataValues)
            } else {
                await CategoryGames.create({
                    category_id: req.body.category_id,
                    game_id: response.id,
                })

                return res.status(200).json(updatedGame.dataValues)
            }

        } else {
            return res.status(404).json({
                error: "Record not found"
            })
        }


    } catch (error) {
        res.status(500).send({ error })
    }
}