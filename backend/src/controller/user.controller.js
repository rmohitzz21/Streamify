import FriendRequest from "../models/FriendRequest.js";

import User from "../models/User.js";

export async function getRecommedndedUsers(req,res) {

    // This function fetches recommended users for the current user
   try {
     const currentUserId = req.user.id;
     const currentUser = req.user;
 
     const recommendedUser = await User.find({
         $and:[
             {_id : {$ne : currentUserId}},
             {_id: {$nin: currentUser.friends}},
             {isOnboarded: true}
             //  isOnboarded is true means the user has completed the onboarding process
             //  onboarding means the user has filled out their profile
         ]
     })
        res.status(200).json(recommendedUser);
   } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({
            message: "Internal server error"
        })
   }

}

// This function fetches the current user's friends and their details
export async function getMyFriends(req,res) {
    try { 
        const user  = await User.findById(req.user.id).select("friends")
        .populate("friends", "fullName profilePic nativeLangauge learningLanguage");

        res.status(200).json({
            friends: user.friends
        })
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// This function sends a friend request to another user
export async function sendFriendRequest(req, res) {
    try {
        
        const myId  = req.user.id;
        const {id: recipientId} = req.params

        if(myId === recipientId){
            return res.status(400).json({
                message: "You cannot send a friend request to yourself."
            })
        }
        //  recipient is the user to whom the friend request is being sent

        const recipient = await User.findById(recipientId);

        if(!recipient){
            return res.status(404).json({
                message: "Recipient not found."
            }); 
        }
        

        // Check if the recipient is already a friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({
                message: "You are already friends with this user."
            })
        }

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender: myId, recipient: recipientId},
                {sender : recipientId, recipient: myId},
            ],
        });

        if(existingRequest){
            return res.status(400).json({message: "Friend request already exists."});
        }
        
        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }   
}

// This function accepts a friend request from another user
export async function acceptFriendRequest(req, res){

    try {
        const {id:requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        // Check if the friend request exists
        if(!friendRequest){
            return res.status(404).json({
                message: "Friend request not found."
            })
        }

        // Check if the current user is the recipient of the friend request
        if(friendRequest.recipient.toString() != req.user.id){
            return res.status(404).json({
                message: "You are not authorized to accept this friend request."
            })
        }

        // Add the sender to the recipient's friends list
        friendRequest.status = "accepted";
        await friendRequest.save();


        // Update both users' friends lists
        // $addToSet ensures that the user is added only if they are not already in the list
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet: { friends: friendRequest.recipient },
        })

        // Add the recipient to the sender's friends list
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        })

        res.status(200).json({
            message: "Friend request accepted successfully.",})

        // Rejecting a friend request can be handled with the same endpoint

    


    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// this function fetches all friend requests for the current user
export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    // res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// This function fetches all outgoing friend requests sent by the current user
export async function getOutgoingFriendRequest(req, res) {
    try {
        const outgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingReqs);
    } catch (error) {
        console.log("Error fetching outgoing friend requests:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}