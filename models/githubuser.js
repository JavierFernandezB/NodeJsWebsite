import sequelize from "sequelize";
import db from '../config/db.js';

export const githubuser = db.define('githubuser',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    userid:{
        type:sequelize.INTEGER
    },
    name:{
        type:sequelize.STRING
    },
    username:{
        type:sequelize.STRING
    },
    avatar_url:{
        type:sequelize.STRING
    },
    gitid:{
        type:sequelize.INTEGER
    }
})
