import axios from "axios";
import e from "cors";
import { Request, Response } from "express";
import { Op } from 'sequelize';
import sequelize from "../../config/dbConnection";
import { seedingData } from "../../constants";
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
            return res.status(200).json(gameResponse.dataValues)
        } else {
            await transaction.rollback();
            console.log("======== CHECKING");
            return res.status(500).send({ error: "Unable to create game right now." })
        }
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return res.status(500).send({ error })
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

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export async function importDummy(req: Request, res: Response) {
    const transaction = await sequelize.transaction();
    try {
        const response = { data: seedingData }

        const unfilteredCats = response.data.map((e: any) => e.category);
        var finalCategories: any[] = [];
        unfilteredCats.forEach((e: any) => {
            if (!finalCategories.includes(e)) {
                finalCategories.push(e);
            }
        });

        const unfilteredTags = response.data.map((e: any) => e.tags.split(",")).flat();

        var finalTags: any[] = []
        unfilteredTags.forEach((e: any) => {
            if (!finalTags.includes(e)) {
                finalTags.push(e)
            }
        })
        console.log(finalTags);

        const tagResponse = await Tag.bulkCreate(finalTags.map(e => {
            return {
                image: 'https://fujifilm-x.com/wp-content/uploads/2019/08/xc16-50mmf35-56-ois-2_sample-images03.jpg',
                name: e.trim(),
                color: getRandomColor()
            }
        }), { transaction })

        const catResponse = await Category.bulkCreate(finalCategories.map((e: any) => {
            return {
                name: e.trim(),
            }
        }), { transaction })

        const allDBCats = catResponse;

        const allCatsJson: { [key: string]: number } = {}
        allDBCats.forEach(e => {
            allCatsJson[e.name] = e.id
        })

        const allDBTags = tagResponse;

        const allTagsJson: { [key: string]: number } = {}
        allDBTags.forEach(e => {
            allTagsJson[e.name] = e.id
        })

        const replacedCats = response.data.map(e => {
            const allTagsSplit = e.tags.split(",").map(e => e.trim())
            const tagsWithIds = allTagsSplit.map(e => allTagsJson[e.trim() as any])
            return {
                name: e.title,
                url: e.url,
                description: e.description,
                thumbnail: e.thumb,
                gif_url: e.thumb,
                game_type: 'B',
                category_id: allCatsJson[e.category.trim() as any],
                tags: tagsWithIds,
                featured: false,
                popular: false,
                top_rated: false,
                height: parseInt(e.height),
                width: parseInt(e.width)
            } as ICreateGameReq
        }) as ICreateGameReq[]

        const addedGames = await Game.bulkCreate(replacedCats, { transaction });

        const catGamesToAdd = addedGames.map((e, index) => {
            return {
                category_id: replacedCats[index].category_id,
                game_id: e.id
            }
        })

        const addCatGames = await CategoryGames.bulkCreate(catGamesToAdd, { transaction })

        const tagGamesToAdd = replacedCats.map((e, index) => {
            return e.tags.map(ele => {
                return {
                    game_id: addedGames[index].id,
                    tag_id: ele
                }
            })
        }).flat()

        const addTagGames = await TagsGames.bulkCreate(tagGamesToAdd, { transaction })

        await transaction.commit()

        return res.status(200).json({ status: "done" })
    } catch (error) {
        console.log(error);

        await transaction.rollback();
        res.status(500).send({ error })
    }
}