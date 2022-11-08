import { Request, Response } from "express";

export function gameList(req: Request, res: Response) {
    res.status(200).json({
        games: [
            {
            }
        ]
    })
}

export function createGame(req: Request, res: Response) {
    res.status(200).json({
        message: "Game Created"
    })
}