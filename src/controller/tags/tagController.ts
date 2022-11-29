import { Request, Response } from "express";
import { ITag } from "../../dto/tags";
import Tag from "../../model/Tag";


export async function tagList(req: Request, res: Response) {
    res.status(200).json(await Tag.findAll())
}

export async function createTag(req: Request<any, any, ITag>, res: Response) {
    try{
        const response = await Tag.create(req.body);

        return res.status(200).json(response.toJSON())
    }catch (error) {
        res.status(500).send({ error })
    }
}