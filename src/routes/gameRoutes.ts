import express from "express";
import { createGame, deleteGame, featuredGameList, gameList, getGameDetail, importDummy, popularGameList, searchGameList, updateGame } from "../controller/games/gameController";
import { categoryList } from "../controller/category/categoryController";

const router = express.Router();

router.get('/', gameList);
// router.post('/seed', importDummy);
router.get('/featured', featuredGameList);
router.get('/popular', popularGameList);
router.get('/search', searchGameList);
router.get('/:id', getGameDetail);
router.patch('/:id', updateGame);
router.delete('/:id', deleteGame);
router.post('/', createGame);

export const gameRoutes = router;