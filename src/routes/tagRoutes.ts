import express from "express";
import { createTag, tagList } from "../controller/tags/tagController";
import { createTagGame, gameListByTagId, tagGamesList } from "../controller/tags/tagGamesController";

const router = express.Router();

router.get('/', tagList);
router.post('/', createTag);

router.get('/games', tagGamesList);
router.get('/:id/games', gameListByTagId);
router.post('/games', createTagGame);

export const tagRoutes = router;