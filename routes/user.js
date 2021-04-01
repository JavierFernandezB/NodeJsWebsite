import express from "express";
import {loginuser,registeruser,registerform,
    loginform,logoffuser,verifyEmail,
    forgotpass,resetpass,forgotuser,
    resetuser,githublog,githubcallback,
    githubregister,profileuser,linkgithub,
    githublinkuserget

} from "../controlers/userControler.js";


const routeruser = express.Router();

const loginrequired=(req,res,next)=>{
    if(req.session.user){
        next();
    }else{
        res.redirect("/user/login")
    }
}

//Login and register users
routeruser.get("/login/",loginuser);
routeruser.get("/logoff",logoffuser);
routeruser.get("/register/",registeruser);
routeruser.post("/register/",registerform);
routeruser.post("/login/",loginform);
routeruser.get("/profile",loginrequired,profileuser)

// Email verify
routeruser.get("/register/verify/:token",verifyEmail);

// Reset Password
routeruser.post("/forgot/",forgotpass);
routeruser.post("/reset/:token",resetpass);
routeruser.get("/forgot",forgotuser);
routeruser.get("/reset/:token",resetuser);

//Github Link
routeruser.get("/github/callback",githubcallback);

//redirect buttons
routeruser.get("/login/github",githublog);
routeruser.get("/register/github",githubregister);
routeruser.get("/login/link",linkgithub);
routeruser.get("/link",loginrequired,githublinkuserget);
// routeruser.get("/register/github",githubreg);
// routeruser.get("/link/github",linkgithub);
export default routeruser;