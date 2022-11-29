import { Request, Response } from "express";
import { Op } from 'sequelize';
import { ICategoryGameReq } from "../../dto/category";
import Category from "../../model/Category";
import CategoryGames from "../../model/CategoryGames";
import Game from "../../model/Game";

export async function categoryList(req: Request<any, any, any, any>, res: Response) {
    res.status(200).json(await Category.findAll());
}

export async function categoryGamesList(req: Request<any, any, any, any>, res: Response) {
    res.status(200).json(await Category.findAll({
        include: {
            model: CategoryGames,
            as: "games",
            foreignKey: 'category_id',
            attributes: ["id", "category_id", "game_id"],
            include: [
                {
                    model: Game,
                    as: "game",
                    foreignKey: "game_id"
                }
            ]
        }
    }));
}

export async function createCategory(req: Request<any, any, ICategoryGameReq>, res: Response) {
    try {
        const response = await Category.create(req.body);

        return res.status(200).json(response.dataValues);
    } catch (err) {
        res.status(500).send({ err })
    }
}


