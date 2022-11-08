import express from "express";
import { createGame, gameList } from "../controller/games/gameController";

const router = express.Router();

router.get('/', gameList)
router.post('/', createGame)
// router.patch('/', updateGame)

export const gameRoutes = router;