import * as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/api-response.js"
import User from "./auth.model.js";

const register = async (req,res)=>{
    console.log("BODY:", req.body);
    
    const user = await authService.register(req.body)
    ApiResponse.created(
        res,
        "registration successful . please verify your email",
        user,
    )
}

const login =async(req,res)=>{
    const{user, accessToken,refreshToken}= await authService.login(req.body)
     res.cookie("refreshToken", refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge: 7 *24*60*60*1000
     })
    ApiResponse.ok(res,"login succesfull",{
        user, accessToken
    })
}

const refreshToken=async (req,res)=>{
    const token =req.cookies?.refreshToken
    const {accessToken}= await authService.refresh(token)
    ApiResponse.ok(res, "token refreshed",{ accessToken})
}

const logout = async (req,res)=>{
    console.log(req.headers.authorization)
    console.log("USER:", req.user);
  await authService.logout(req.user.id)
  res.clearCookie("refreshToken")
  ApiResponse.ok(res,"logged out succesfully")
}


const verifyEmail= async(req,res)=>{
    await authService.verifyEmail(req.params.token)
    ApiResponse.ok(res,"email verified succesfully")

}

const forgotPassword =async(req,res)=>{
    await authService.forgotPassword(req.body.email)
    ApiResponse.ok("password reset email sent")

}

const resetPassword=async(req,res)=>{
    await authService.resetPassword(req.params.token, req.body.password)
    ApiResponse.ok(res, "password reset succesfull")
}

const getMe =async(req,res)=>{
    
    await authService.getMe(req.user.id)
    ApiResponse.ok(res, "User Profile",req.user )

}







export {
    register,
    login,
    refreshToken,
    logout,
    resetPassword,
    getMe,verifyEmail,
    forgotPassword,
}