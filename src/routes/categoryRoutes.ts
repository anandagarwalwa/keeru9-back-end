import express from 'express'
import { categoryGamesList, categoryList, createCategory } from '../controller/category/categoryController';

const categoryRouter = express.Router()
//category
categoryRouter.get('/', categoryList);
categoryRouter.get('/games', categoryGamesList);
categoryRouter.post('/', createCategory);

export default categoryRouter