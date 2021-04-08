import { users,emailToken,recpass,githubuser } from "../models/index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {mail} from "../nodemail/mail.js";
import axios from "axios";
import fetch from "node-fetch";

const salt = await bcrypt.genSalt(10);
function getminutes(creation){
    var create=new Date(creation);
    var actual=new Date(new Date().toISOString().slice(0,19).replace("T"," "))
    return Math.round((actual.getTime() - create.getTime()) / 60000);
}
const validate=async(user)=>{
    var errors={};
    console.log(user)
    try{
        var isused =await users.findOne({where:{username:user.username}});
        
    }catch(error){
        console.log("error al buscar usuario")
        
    }
    try{
        var emailused=await users.findOne({where:{email:user.email}});
    }catch(error){
        console.log("error al buscar email")
    }
    
    if(emailused!=null){
        errors.email="email en uso";
    }
    if(user.email==""){
        errors.email="ponga un email";
    }
    if(isused!=null){
        errors.user="usuario ya existe o es muy corto";
    }
    if(user.password<8){
        errors.password="password es muy corta";
    }
    
    if(Object.keys(errors).length==0){
        return 1;
    }else{
        return errors;
    }
    
}

function getdate(){
    return new Date().toISOString().slice(0, 10).replace('T', ' ');
}
function getfulldate(){
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}
const loginuser = (req, res)=>{
    var errors={};
    var info={};
    if(req.session.user){
        return res.redirect("/");
    }
    res.render("login",{errors,info});
}

const registeruser = (req, res)=>{
    if(req.session.user){
        res.redirect("/");
    }
    var errors={}
    var info={}
    res.render("register",{errors,info});
}

const loginform = async (req,res)=>{
    var errors={};
    var info={};
    var username = req.body.username;
    var password = req.body.password;
    info.username=username;
    
    try {
        var User = await users.findOne( {where:{username}});
        if(User){
            var solution = await bcrypt.compare(password,User.password);
            if(solution && User){
                req.session.user=User;
                User.lastconnection=getdate();
                User.save()
                return res.redirect("/");
            }else{
                errors.password="password incorrect";
            }
        }else{
            errors.user="user not founded";
        }
        console.log("empiza");
        res.render("login",{errors,info});
        
        
        
    } catch (error) {
        console.log(error);
        res.send("ERROR");
    }
}

const registerform = async (req,res) =>{
    var result=await validate(req.body);
    var result=1;
    if(result==1){ 
        const newUser = await users.create({
            email: req.body.email,
            username: req.body.username,
            lastconnection:getdate(),
            creationtime:getdate(),
            password: await bcrypt.hash(req.body.password, salt),
                      
          });
          
          var id = newUser.id;
        const usertoken=await emailToken.create({
            userid:id,
            emailToken:crypto.randomBytes(64).toString('hex')
        })
        const userrecpass=await recpass.create({userid:id});
        mail.mailOptions.to=newUser.email;
        mail.mailOptions.html=`<a href='http://localhost:4000/user/register/verify/${usertoken.emailToken}'>Verify email</a>`;
        mail.sendmail(mail.mailOptions);
        newUser.save();
        res.redirect("/user/login");
    }else{
        var info={
            password: req.body.password,
            email: req.body.email,
            username: req.body.username,
        }
        res.render("register",{
            errors:result,
            info
        })
       
    }
    
}

const logoffuser = (req,res)=>{
    req.session.user=null;
    res.redirect("/");
}

const profileuser = (req,res)=>{
    res.render("profile");
} 

const verifyEmail=async(req,res)=>{
    var email={}
    try{
        const searchtoken = await emailToken.findOne({where:{emailToken:req.params.token}})
        if(!searchtoken){
            email.error="token not found"
            res.render("verifyEmail",{email})
        }
       var id =searchtoken.userid;
       const user = await users.findOne({where:{id}});
       user.verified=true;
       user.save();
       if(user){
        req.session.user=user;
        email.success="Email verificated";
        res.render("verifyEmail",{email})   
   }
    }catch (e){
        console.log(e)
    }
   
}

const forgotpass=async(req,res)=>{
    var errors={};
    var email = req.body.email;
    if(email){
        var found = await users.findOne({where:{email}});
        if(found){
            var token= await recpass.findOne({where:{userid:found.id}});
            token.token=crypto.randomBytes(64).toString('hex');
            token.creation=getfulldate();
            found.save();
            token.save();
            mail.mailOptions.to=email;
            mail.mailOptions.text="hola que tal";
            mail.mailOptions.html=`<a href='http://localhost:4000/user/reset/${token.token}'>Verify Email</a> `;
            mail.sendmail(mail.mailOptions);
            errors.success="Email Verified";
            res.render("./0auth/forgot",{errors});
        }else{
            errors.email="error email not found"
            res.render("./0auth/forgot",{errors})
        }
    }else{
        errors.email="need email"
        res.render("./0auth/forgot",{errors})
    }
}

const resetpass=async(req,res)=>{
    const TokenTimeMin=500000;
    var errors={};
    errors.tokenform=req.params.token;
    var token=req.params.token;
    if(token){
        var finduser=await recpass.findOne({where:{token}});
        if(finduser){
            if(getminutes(finduser.creation)<TokenTimeMin){
                var user=await users.findOne({where:{id:finduser.userid}});
                if(user){
                    if(req.body.password.trim()==req.body.password2.trim()){
                        var pass=req.body.password;
                        user.password=await bcrypt.hash(req.body.password, salt)
                        //finduser.token="";
                        user.save();
                        finduser.save();
                        errors.success="Password Changed"
                        return res.render("./0auth/reset",{errors})
                    }else{
                        errors.match="password dont match"
                        return res.render("./0auth/reset",{errors})
                    }
                }else{
                    errors.user="user not found";
                    return res.render("./0auth/reset",{errors});
                }
            }else{
                errors.token="token outdated";
                res.render("./0auth/reset",{errors})
            }
            
        }else{
            errors.token="token not found";
            return res.render("./0auth/reset",{errors})
        }
    }else{
        errors.token="need token";
        return res.render("./0auth/reset",{errors})
    }   
}

const forgotuser=(req,res)=>{
    var errors={}
    res.render("./0auth/forgot",{errors});
}

const resetuser=async (req,res)=>{
    var errors={};
    errors.tokenform=req.params.token;
    var finduser=await recpass.findOne({where:{token:req.params.token}});
    if(!finduser){
        errors.invalid="Invalid Token or Outdated"
    }
    res.render("./0auth/reset",{errors});
}



//github
const githublog=(req,res)=>{
    var callback = "http://localhost:4000/user/github/callback";
    const url=`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUBCLIENT}&redirect_uri=${callback}&state=login`
    res.redirect(url);
}

const githublinkuserget=async(req,res)=>{
    if(req.session.github){
        var checkgit = await githubuser.findOne({where:{gitid:req.session.github.id}});
        if(!checkgit){
            var loguser= await users.findOne({where:{id:req.session.user.id}})
            if(loguser){
                var git=await githubuser.create({name:req.session.github.login,username:req.session.github.name,
                    userid:loguser.id,avatar_url:req.session.github.avatar_url,gitid:req.session.github.id})
                git.save();
                return res.render("profile",{bien:"TOdo bien"})
            }else{
                return res.render("profile",{bien:"Mal buscar user"})
            }
        }else{
            res.render("profile",{bien:"usuario ya esta linkeado con github"})
        }
        
    }else{
        return res.render("profile",{bien:""})
    }
}



const linkgithub=(req,res)=>{
    var callback = "http://localhost:4000/user/github/callback";
    const url=`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUBCLIENT}&redirect_uri=${callback}&state=link`
    res.redirect(url);
}

const githubcallback=async (req, res) => {
  var state=req.query.state;
  var code= req.query.code;
  var token = await getAccessToken({code});
  if(token){
      if(state=="link"){
          req.session.github= await fetchGitHubUser(token);
          return res.redirect("/user/link");
      }else if(state=="login"){
          var searchgithub=await fetchGitHubUser(token);
          var usergit=await githubuser.findOne({where:{login:searchgithub.login}});
          var user=await users.findOne({where:{}})
        req.session.github= searchgithub;
        return res.redirect("/user/link");
      }
    res.json({x});
  }else{
      res.json({bien:"no"})
  }
};



async function getAccessToken({code}) {
    const body = {
    client_id: process.env.GITHUBCLIENT,
    client_secret: process.env.GITHUBPRIVATE,
    code
  };
  const opts = { headers: { accept: 'application/json' } };
  var x = await axios.post(`https://github.com/login/oauth/access_token`, body, opts);
  if(x.data.access_token){
      return x.data.access_token;
  }else{
      console.log(x.data);
      return false;
  }

}

async function fetchGitHubUser(token) {
    const request = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": "token " + token
      }
    });
    return await request.json();
}


export {
    loginuser,registeruser,loginform,registerform,
    logoffuser,profileuser,verifyEmail,forgotpass,
    resetpass,forgotuser,resetuser,githublog,
    githubcallback,linkgithub,
    githublinkuserget
}
