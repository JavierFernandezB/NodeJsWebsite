import e from "express";
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'nodemailjs2021@gmail.com',
        pass: 'nodemailpass'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
let mailOptions = {
      from: '"Nodemailer Contact" <nodemailjs2021@gmail.com>', // sender address
      to: '', // list of receivers
      subject: 'Verify email', // Subject line
      text: 'Hi sir', // plain text body
      html: '' // html body
};
async function sendmail(mailOptions){
    try{
        transporter.sendMail(mailOptions,(err,info)=>{
            console.log(err);
        });
    }catch (e){
        console.log(e);
    }
}



var mail={mailOptions,sendmail}

export{mail};