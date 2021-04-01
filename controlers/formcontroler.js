import { users } from "../models/index.js";
const veruser= async (req,res) =>{
const user=req.body;
const busqueda=await users.findOne({where:user});
if(busqueda==null){
    res.json({
        error:"usuario no encontrado"
    })
}else{
    res.json(busqueda);
}
 
}

export {veruser};