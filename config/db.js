import sequelize from 'sequelize';

const db = new sequelize('website', 'root', '', {
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    define: {
        timestamps: false,
        freezeTableName: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,

    },
    operatorAliases: false
});

export default db;