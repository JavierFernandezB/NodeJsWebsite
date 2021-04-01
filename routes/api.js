import express from "express";
import { pagina_api,apisearch } from "../controlers/apiControler.js";
import { veruser } from "../controlers/formcontroler.js"
const router2 = express.Router();



router2.get("/:nombre", apisearch);
router2.post("/",veruser);
router2.get("/", pagina_api);

export default router2;