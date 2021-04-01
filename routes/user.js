import express from "express";
import {loginuser,registeruser,registerform,
    loginform,logoffuser,verifyEmail,
    forgotpass,resetpass,forgotuser,
    resetuser,githublog,githubcallback,
    githubregister,

} from "../controlers/userControler.js";


const routeruser = express.Router();


//Login and register users
routeruser.get("/login/",loginuser);
routeruser.get("/logoff",logoffuser);
routeruser.get("/register/",registeruser);
routeruser.post("/register/",registerform);
routeruser.post("/login/",loginform);

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

//get page
// routeruser.get("/register/github",githubreg);
// routeruser.get("/link/github",linkgithub);
export default routeruser;