import nodemailer from "nodemailer"
// import dotenv from "dotenv";
// dotenv.config();
// console.log("HOST:", process.env.SMTP_HOST);
// console.log("USER:", process.env.SMTP_USER);
// console.log("PASS:", process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port : Number(process.env.SMTP_PORT) || 587,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,

    }
})

const sendEmail= async(to, subject, html) =>{
    try {
        const info=await transporter.sendMail({
        from : `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>` ,
        to,
        subject,
        html,
    })
     console.log("Email sent:", info.messageId);
    } catch (error) {
        console.log("EMAIL ERROR:", error);
    }
}

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail(
    email,
    "Verify your email",
    `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
  );
};

const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail(
    email,
    "Reset your password",
    `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  );
};

export{
    sendResetPasswordEmail,
    sendVerificationEmail,

}