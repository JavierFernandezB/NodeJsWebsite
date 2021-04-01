import express from "express";
import {adminuser} from "../controlers/adminControler.js";
const routeradmin = express.Router();

routeradmin.get("/",adminuser);

export default routeradmin;