// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//     host: "live.smtp.mailtrap.io",
//     port: 587,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
// })

// // export default transporter

// const sendEmail = async (req, res) => {
//     const response = await transporter.sendMail({










//     })
//     return response
// }
// export default sendEmail



import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

async function sendSimpleMessage() {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: process.env.API_KEY || "API_KEY",
        // When you have an EU-domain, you must specify the endpoint:
        // url: "https://api.eu.mailgun.net"
    });
    try {
        const data = await mg.messages.create("sandboxd334b10d3325498ea7885978c47ecc91.mailgun.org", {
            from: "Mailgun Sandbox <postmaster@sandboxd334b10d3325498ea7885978c47ecc91.mailgun.org>",
            to: ["Carlos Ayoroa <carlosesteban.ayoroamurillo@gmail.com>"],
            subject: "Hello Carlos Ayoroa",
            text: "Congratulations Carlos Ayoroa, you just sent an email with Mailgun! You are truly awesome!",
        });

        console.log(data); // logs response data
    } catch (error) {
        console.log(error); //logs any error
    }
}
export default sendSimpleMessage