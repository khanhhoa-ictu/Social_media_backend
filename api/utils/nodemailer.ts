export {}
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(
    {
     service: 'gmail',
     auth: {
       user: 'khanhhoatest@gmail.com',
       pass: 'xoewrocbmfajmwjh'
     },
     tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
    }
 )

exports.sendEmail = async (email:string, token:string) => {
    let mailOptions = {
        from: '"Margetsni 👻" <khanhhoatest@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Account Verification Token', // Subject line
        text: 'Hello my friend',
        html: '<b>verify your account</b>'
            + ' <br/>'
            + '<span>Please verify your account by clicking the link</span>'
            + '<br/>'
            + '<span>https://khanhhoa-ictu.github.io/Social_Media/#/confirm/' + token +  '</span>'
    };
    try{
        let send = await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.log(err);
        return false;
    }
    return true;
}

exports.sendEmailForgotPassword = async (email:string, token:string) => {
    let mailOptions = {
        from: '"Margetsni 👻" <khanhhoatest@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Forgot password Verification Token', // Subject line
        html: '<b>Forgot password</b>'
            + ' <br/>'
            + '<span>Please enter OTP below</span>'
            + '<br/>'
            + '<span>' + token +  '</span>'
    };
    try{
        let send = await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.log(err);
        return false;
    }
    return true;
}
