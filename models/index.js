import {emailToken} from "./emailToken.js";
import {users} from './modelo.js';
import {recpass} from "./recoverpass.js";
import {githubuser} from "./githubuser.js"
//assoc
users.hasMany(emailToken);
emailToken.belongsTo(users);

//assoc
users.hasMany(recpass);
recpass.belongsTo(users);

//asoc
users.hasMany(githubuser);
githubuser.belongsTo(users);

export{
    users,
    emailToken,
    recpass,
    githubuser
}