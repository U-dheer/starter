const nodemailer = require('nodemailer');


const sendEmail = async options => {

    // 1) Create a transporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // 2) Define the email options
    const mailoptions = {
        from: 'uditha dheerendra <hello@udi.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
        //html
    }
    // 3) Actually send the email
    await transport.sendMail(mailoptions);

}

module.exports = sendEmail;