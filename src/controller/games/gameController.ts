import { Request, Response } from "express";
import { Op } from 'sequelize';
import { ICreateGameReq, IGameDetailParam, ISearchGamesQuery } from "../../dto/games";
import Game from "../../model/Game";
import Tag from "../../model/Tag";
import TagsGames from "../../model/TagsGames";

export async function gameList(req: Request<any, any, any, any>, res: Response) {
    res.status(200).json(await Game.findAll())
}

export async function createGame(req: Request<any, any, ICreateGameReq>, res: Response) {
    try {
        const response = await Game.create(req.body);

        return res.status(200).json(response.toJSON())
    } catch (error) {
        res.status(500).send({ error })
    }
}

// get game detail api/games/1
export async function getGameDetail(req: Request<IGameDetailParam>, res: Response) {
    const response = await Game.findOne({
        where: {
            id: req.params.id
        },
        include: {
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
        }
    })

    if (response) {
        res.status(200).json(response)
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
            return res.status(200).json(updatedGame.dataValues)
        } else {
            return res.status(404).json({
                error: "Record not found"
            })
        }


    } catch (error) {
        res.status(500).send({ error })
    }
}