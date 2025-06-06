import express from 'express';
import { login, logout, signup, onboard } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login',login);
router.post('/logout', logout);

// logout we use post method because we are sending the token in the body 
// this destroy the session on the server side


router.post("/onboarding", protectRoute, onboard);
// Protected route for onboarding
// This route is used to update the user profile after signup

// forget-Password



// check if the user is logged in
router.get('/me', protectRoute, (req,res) => {
    res.status(200).json({
        success: true,
        user :req.user
    })
})


export default router;