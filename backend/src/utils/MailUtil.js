//to,from,subject,text
const mailer = require('nodemailer');

const sendingMail = async(to,subject,text) => {

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth:{
            user:"",
            pass:""
        }
    })

    const mailOptions = {
        from: '',
        to: to,
        subject: subject,
        html: text
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;

}

module.exports ={
    sendingMail
}