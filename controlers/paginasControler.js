import { users } from "../models/index.js";


const paginaIncio = (req, res) => {
    res.render("main");
}


const paginaSegunda = (req, res) => {
    res.send("hola");
}

const buscarapi = (req,res)=>{
    res.render("buscar");
}

export {
    paginaIncio,
    paginaSegunda,
    buscarapi
    
}