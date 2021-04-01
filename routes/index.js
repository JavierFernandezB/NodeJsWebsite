import express from "express";
import { paginaIncio,paginaSegunda,buscarapi } from "../controlers/paginasControler.js";
const router = express.Router();

//rutas
router.get("/", paginaIncio);

router.get("/a", paginaSegunda)
router.get("/buscar",buscarapi);
export default router;