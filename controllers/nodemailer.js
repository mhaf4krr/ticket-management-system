const nodemailer = require('nodemailer');

function sendTicketInfo(email, message) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "hyderdevelops@yahoo.com", // generated ethereal user
            pass: "mcgqQtPG3Zp339W" // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"noreply@GrievancePortal IUST" <hyderdevelops@yahoo.com', // sender address
        to: email, // list of receivers
        subject: 'GRIEVANCE UPDATE | IUST PORTAL ✔', // Subject line
        text: `${message}`, // plain text body
        html: `<body> ${message} </body>` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


    })
}

module.exports = sendTicketInfo;