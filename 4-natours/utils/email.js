const nodemailer = require('nodemailer');
// const { MailtrapTransport } = require("mailtrap");

const token = process.env.TOKEN

const sendEmail = async options =>{
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'live.smtp.mailtrap.io',
        port: 587,
        secure: false, // use SSL
        auth: {
            user: '1a2b3c4d5e6f7g',
            pass: '1a2b3c4d5e6f7g',
        }
    });
    // 2) Define the email oprtions
    const mailOptions = {
        from: 'Aman Rawat <asr@mail.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    // 3) Actually sends the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail