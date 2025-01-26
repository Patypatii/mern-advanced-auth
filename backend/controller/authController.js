import { response } from 'express';
import { sendPasswordResetEmail, sendresetSuccesfulEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js';
import {User} from '../models/user.model.js'
import { generateTokenAndSetCoockie } from '../utils/generateTokenAndSetCoockie.js';
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'

export const signup = async (req, res)=>{

    const {email, password, name} = req.body;
    
    try {
        console.log("Request Body:", req.body);
       if (!email || !password || !name) {
         throw new Error("All fields are required");
         
       }
         const userAlreadyExists = await User.findOne({email});
         if (userAlreadyExists) {
            return res.status(404).json({success: false, message: "user already exists"})
         }

         const hashedPassword = await bcryptjs.hash(password, 10);
         const verificationToken = Math.floor(100000 + Math.random()* 900000).toString();
         const user = new User ({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24*60*60*1000 // equals 24hrs

         })

         await user.save();
         


         //jwt
         generateTokenAndSetCoockie(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);

         res.status(201).json({
            success: true,
            message: "user created succesfully",
            user:{
                ...user._doc,
                password: undefined
            }
         })

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({success: false, message: "Invalid or Expired verification code"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user:{
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log("Error in verifying the email", error);
        res.status(400).json({success: false, message: error.message})
    }
}
export const login = async (req, res)=>{
    const {email, password} = req.body;

    try {
        const user = await  User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "Invalid credentials!"});

        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid credentials!"})
        }


        generateTokenAndSetCoockie(res, user._id);

        user.lastLogin = new Date();

        await user.save();

        res.status(200).json({
            success: true, 
            message: "Login successful!",
            user:{
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log("Error in login", error);
        res.status(400).json({success: false, message: error.message})
        
    }
}
export const logout = async (req, res)=>{
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Logged out succesfully"})
}
export const forgotPassword = async (req, res) =>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});

        }

        //Generate a reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        const resetTokenExpiresAt = Date.now() + 1 *60*60*1000;// 1hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        //send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        res.status(200).json({success: true, message: "Password reset link sent to your email"})
        console.log("Password reset link sent to your email",response);
        


    } catch (error) {
        console.log("Error in forgot password", error);
        res.status(400).json({success: false, message: error.message})
        
    }
}

export const resetPassword = async (req, res) =>{
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        });

        if(!user){
            return res.status(400).json({success: false, message: "Invalid or expired reset password token"});
        }

        //update password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();
        await sendresetSuccesfulEmail(user.email);

        res.status(200).json({success: true, message: "Password reset succesful"})
    } catch (error) {
        console.log("Error in reset password", error);
        res.status(400).json({success: false, message: error.message})
        
    }
}

export const checkAuth = async (req, res) =>{
    try {
        const user = await User.findById(req.userId)
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});

        }

        res.status(200).json({success: true, user:{
            ...user._doc,
            password: undefined,
        }})
    } catch (error) {
        console.log("Error in checking Auth", error);
        res.status(400).json({success: false, message: error.message})
        
    }
}