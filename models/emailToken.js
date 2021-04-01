import sequelize from "sequelize";
import db from '../config/db.js';

export const emailToken = db.define('emailtokens',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    userid:{
        type:sequelize.INTEGER
    },
    emailToken:{
        type:sequelize.STRING
    }
})
