const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.mailhost,
                auth:{
                    user: process.env.mailuser,
                    pass: process.env.mailpassword,
                }
            })


            let info = await transporter.sendMail({
                from: "Ecommerce",
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender;