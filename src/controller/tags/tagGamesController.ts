import { Request, Response } from "express";
import { ICreateTagGame } from "../../dto/tagGames";
import Game from "../../model/Game";
import Tag from "../../model/Tag";
import TagsGames from "../../model/TagsGames";


export async function tagGamesList(req: Request, res: Response) {
    res.status(200).json(await TagsGames.findAll({
        include: [
            {
                model: Tag,
                as: "tag",
            },
            {
                model: Game,
                as: "game",
            }
        ]
    }))
}


export async function gameListByTagId(req: Request<any, any, {
    id: number
}>, res: Response) {
    res.status(200).json(await TagsGames.findAll({
        where: {
            tag_id: req.params.id
        },
        include: [
            {
                model: Game,
                as: "game"
            }
        ]
    }))

}

export async function createTagGame(req: Request<any, any, ICreateTagGame>, res: Response) {
    try {
        const response = await TagsGames.create(req.body);

        return res.status(200).json(response.toJSON())
    } catch (error) {
        res.status(500).send({ error })
    }
}