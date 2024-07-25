'use strict';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

export default async function sendCode(email: string, url: string, username: string) {
    const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Account verification',
        html: `
                Hello ${username},
                You registered an account on Testhetic, before being able to use your account you need to verify that this is your email address by clicking here: <a href='${url}'>Link</a>
                Kind Regards, Testhetic 
            `
    }, (error, info) => {
        if (error) {
            throw ({ status: 500, message: error.message });
        }
        transporter.close();
    });
}