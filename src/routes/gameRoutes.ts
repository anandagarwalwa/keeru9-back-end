import express from "express";
import { createGame, deleteGame, gameList, getGameDetail, searchGameList, updateGame } from "../controller/games/gameController";
import { categoryList } from "../controller/category/categoryController";

const router = express.Router();

router.get('/', gameList);
router.get('/search', searchGameList);
router.get('/:id', getGameDetail);
router.patch('/:id', updateGame);
router.delete('/:id', deleteGame);
router.post('/', createGame);

export const gameRoutes = router;