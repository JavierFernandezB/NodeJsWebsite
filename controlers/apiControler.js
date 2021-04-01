import { users } from "../models/index.js";


const pagina_api = async (req, res) => {
    //consultar datos
    try{
        const usuarios = await users.findAll();
        
        res.json({
        usuarios
        });
    }catch(error){
        res.json({
            error:"error con la base de datos"
        });
    }
    
    
}


const apisearch=async (req,res) => {
    const username=req.params;
    try{
        const usuarios = await users.findOne( {where : {username} });
        if(usuarios==null){
            res.json({
                error:"usuario no encontrado"
            });
        }else{
            res.json({
                usuarios
            }); 
        }
        
    }catch(error){
        
        res.json({
            error:"error con la base de datos"
        });
    }
    
    
}


export {
    pagina_api,
    apisearch,
    
}