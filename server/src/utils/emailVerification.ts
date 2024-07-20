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

export default async function sendCode(email: string, url: string) {
    const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Account verification',
        html: `<a href='${url}'>Click on the link to verify your account</a>`
    }, (error, info) => {
        if(error) {
            throw({status: 500, message: error.message});
        }
        transporter.close();
    });
}