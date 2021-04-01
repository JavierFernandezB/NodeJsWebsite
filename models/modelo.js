import sequelize from 'sequelize';
import db from '../config/db.js';


export const users = db.define('users', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    },
    creationtime: {
        type: sequelize.DATE
    },
    lastconnection: {
        type: sequelize.DATE
    },
    email:{
        type:sequelize.STRING
    },
    coins:{
        type:sequelize.INTEGER
    },
    verified:{
        type:sequelize.BOOLEAN
    }

});


