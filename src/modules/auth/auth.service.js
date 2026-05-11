import User from "./auth.model.js"
import ApiError from"../../common/utils/api-error.js"
import crypto from "crypto"
import {
    generateAcccessToken,
    generateRefreshToken,
    generateResetToken,
    verifyRefreshToken
}  from "../../common/utils/jwt.utils.js"

import { sendResetPasswordEmail,sendVerificationEmail } from "../../common/config/email.js"


const hashToken = (token) => {
  if (!token) throw new Error("Token is required");

  return crypto
    .createHash("sha256")
    .update(String(token))
    .digest("hex");
};

const register = async ({name,email,password,role})=>{
    const existing= await User.findOne({email})
    if (existing) throw ApiError.conflict("Email already registered")

const {rawToken, hashedToken} = generateResetToken()
        const user = await User.create({
            name,
            email,
            password,
            role,
            verificationToken:hashedToken,
        })
        try {
            console.log("email sends")
            await sendVerificationEmail(email,rawToken)
            
        } catch (err) {
            console.error("failed to send verification email")
            
        }
        console.log("meri mrzi")

        const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;

  return userObj;
}   


const login =async({email,password})=>{

    console.log("login route entering")
    const user= await User.findOne({email}).select("+password")
    if(!user) throw ApiError.unauthorized("Inavlid email or passowrd")

        const isMatch =await user.comparePassword(password)
        if(!isMatch) throw ApiError.forbidden("Inavlid email or passowrd")

            if(!user.isVerified){
                throw ApiError.forbidden("please verify your email")
            }

            const accessToken = generateAcccessToken({id:user._id, role: user.role})
            const refreshToken = generateRefreshToken({id:user._id})

            //store hashed refresh token in db so it be

            user.refreshToken= hashToken(refreshToken)
            await user.save({ validateBeforeSave:false})

            const userobj = user.toObject()
            delete userobj.password
            delete userobj.refreshToken

            return{ user: userobj, accessToken, refreshToken}
}


const refresh = async (token)=>{
    if(!token) throw ApiError.unauthorized("refresh token missing")

        const decoded= verifyRefreshToken((token))

        const user = await User.findById(decoded.id).select("+refreshToken")
        if(!user) throw ApiError.unauthorized("user no long exists")

            if(user.refreshToken!==hashToken(token)){
                throw ApiError.unauthorized("invalid refresh token -please log in again ")
            }

            const accessToken= generateAcccessToken({id:user._id, role: user.role})

return {accessToken}

} 

const logout =async(userId)=>{

    await User.findByIdAndUpdate(userId,{refreshToken:null})
}




const verifyEmail = async (token) => {
  const trimmed = String(token).trim();

  if (!trimmed) {
    throw ApiError.badRequest("Invalid or expired verification token");
  }

  const hashedInput = hashToken(trimmed);

  const user = await User.findOne({
    verificationToken: hashedInput,
  }).select("+verificationToken");

  console.log("Incoming token:", trimmed);
  console.log("Hashed token:", hashedInput);
  console.log("User found:", user);

  if (!user) {
    throw ApiError.badRequest("Invalid or expired verification token");
  }

  await User.findByIdAndUpdate(user._id, {
    $set: { isVerified: true },
    $unset: { verificationToken: 1 },
  });

  return user;
};

const forgotPassword = async(email)=>{
const user = await User.findOne({email})
if (!user) throw ApiError.notfound("no account with this email exist")
    const {rawToken,hashToken}= generateResetToken()

user.resetPasswordToken= hashedToken
user.resetPasswordExpires= date.now() + 15 *60*1000
await user.save()

try {
    await sendResetPasswordEmail(email, rawToken)
} catch (error) {
    console.error("Failed to send reset email:", err.message)
    
}

}

const resetPassword = async (token,newPassowrd)=>{
    const hashedToken= hashToken(token)

    const user = await User.findOne({
        resetPasswordToken:hashedToken,
        resetPasswordExpires:{
            $gt:Date.now()
        },
    }).select("+resetPasswordToken +resetPasswordExpires")

if(!user) throw ApiError.badRequest(" Invalid or expired token")

user.password = newPassowrd,
user.resetPasswordToken=undefined,
user.resetPasswordToken= undefined

await user.save()
}

const getMe = async(userId)=>{
    const user = await User.findOne(userId)
    if(!user) throw ApiError.notfound("user not found")
        return user

}






export {
    register,
    login,
    refresh,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getMe
}