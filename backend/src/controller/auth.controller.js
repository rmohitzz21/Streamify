import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
    // res.send("Signup Route ");
    const {  fullName, email, password } = req.body;

    try {
        if(!email || !password || !fullName){
            return res.status(400).json({ message : "All Fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({ message : "Password must be at least 6 characters long"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ message : "Invalid Email Format"});
        }

        const existingUser  =  await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({ message : "User already exists with this email"});
        }

        const idx = Math.floor(Math.random() * 100 )+ 1; // Genrate num between 1 to 100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar

        })

      try {
          await upsertStreamUser({
              id: newUser._id.toString(),
              name: newUser.fullName,
              image: newUser.profilePic || "",
          });
          console.log(`User upserted in Stream successfully ${newUser.fullName}`);
      } catch (error) {
        console.log("Error in upserting user in Stream: ", error);
        
      }


        // CRETAE USER IN STREAM AS WELL

        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d' 
        })

        res.cookie("token", token, {
            maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS only
            sameSite : "strict" // Helps prevent CSRF attacks
        })

        res.status(201).json({
            success: true,
            user: newUser,
        })

    } catch (error) {
        console.log("Error in Signup Controller: ", error);
        res.status(500).json({ message: "Internal Server Error "});
        
    }
}

export  async function login(req, res) {
    // res.send("Login  Route ");
    try {

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({ message : "All Fields are required"});
        }

        const user = await User.findOne({ email});

        if(!user){
            return res.status(401).json({ message : "Invalid Email"});
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) return res.status(401).json({ message : "Invalid  password"});
        

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d' 
        })
        console.log(res);
        
        res.cookie("token", token, {
            maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS only
            sameSite : "strict" // Helps prevent CSRF attacks
        })

        res.status(200).json({
            success: true,
            user,
        })

    } catch (error) {
        
        console.log("Error in Login Controller: ", error);
        res.status(500).json({ message: "Internal Server Error "});
    }

}

export async function logout(req, res) {
    // res.send("Logout Route ");
    res.clearCookie("token")
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}


export async function onboard(req, res) {
   
    try {
    // onboard used to update the user profile after signup
    const userId = req.user._id;
    const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
        return res.status(400).json({ message : "All Fields are required",
            missigFields: [
                !fullName && "fullName",
                !bio && "bio",
                !nativeLanguage && "nativeLanguage",
                !learningLanguage && "learningLanguage",
                !location && "location"
        ].filter(Boolean)
        });
    } 

    
    const updatedUser  = await User.findByIdAndUpdate(userId, {
        // used to update the user profile
        fullName,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        isOnboarded: true,

    }, {new : true});


    if(!updatedUser){
        return res.status(404).json({ message: "User not found" });

     try {
        // used upsertStreamUser to create or update the user in Stream
           await upsertStreamUser({
               id: updatedUser._id.toString(),
               name:updatedUser.fullName,
               image: updatedUser.profilePic || "",
           })
           console.log(`Stream User Updated SuccessFully : ${updatedUser.fullName}`);
           
     } catch (streamError) {
        console.log("Error in upserting user in Stream: ", streamError);
     }
    }

    return res.status(200).json({
      message: "User onboarded successfully",
      user: updatedUser,
    });
}catch (error) {
        console.error("Error in onboard controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });

    }

}