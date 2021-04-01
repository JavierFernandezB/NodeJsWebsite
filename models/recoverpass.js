import sequelize from 'sequelize';
import db from '../config/db.js';

export const recpass = db.define('recoverpass',{
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userid:{
        type:sequelize.INTEGER
    },
    token:{
        type:sequelize.STRING
    },
    creation:{
        type:sequelize.DATE
    }
})