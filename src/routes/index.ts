import express from "express";
import categoryRouter from "./categoryRoutes";
import { gameRoutes } from "./gameRoutes";
import { tagRoutes } from "./tagRoutes";

const router = express.Router();

router.use('/games', gameRoutes);

router.use('/tags', tagRoutes);
router.use('/category', categoryRouter);

export default router