import express from 'express';
import router from "./routes/index.js";
import router2 from "./routes/api.js";
import routeruser from "./routes/user.js";
import routeradmin from "./routes/admin.js";
import db from './config/db.js';
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
// crear la app
const app = express();
//asignar puerto
const port = process.env.PORT || 4000;
//concectar db
db.authenticate()
    .then(() => console.log("conectado a la base de datos"))
    .catch(error => console.log(1));

// agregar el pug
app.set("view engine", "pug");
// add bodt parser para datos del form
app.use(express.urlencoded({extended : true}));

//agregar carpeta public
app.use(express.static("public"));

// use sessions
app.use(session({
    secret:'session',
    resave:false,
    saveUninitialized:true,
}));

app.use((req, res, next)=> {
    if(req.session.user){
        res.locals.user=req.session.user;
    }else{
        res.locals.user=null;
    }
    
    next();
});

//agregar router
app.use("/", router);
app.use("/api/v1", router2);
app.use("/user/",routeruser);
app.use("/admin",routeradmin);
// empezar servidor
app.listen(port, () => {
    console.log(`empezando en el puerto ${port}`);
});