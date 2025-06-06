import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';

import { getRecommedndedUsers, getMyFriends, acceptFriendRequest, sendFriendRequest, getFriendRequest, getOutgoingFriendRequest }  from '../controller/user.controller.js';


const router = express.Router();

router.use(protectRoute); 
// Apply the protectRoute middleware to all routes in this router

router.get("/", getRecommedndedUsers);
router.get("/friends", getMyFriends);


router.post("/friend-request/:id", sendFriendRequest); 
router.put("/friend-request/:id",acceptFriendRequest);
router.put("/friend-request/:id/reject", acceptFriendRequest); // Assuming you want to handle rejection with the same endpoint

router.get("/friend-request", getFriendRequest);
router.get("/outgoing-friend-request", getOutgoingFriendRequest);

export default router;