import express from "express";
import { fetchAllProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/",fetchAllProducts)

export default router;