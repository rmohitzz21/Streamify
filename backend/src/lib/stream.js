import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY and STREAM_API_SECRET Missing.");
}

// Initialize the StreamChat client with the API key and secret
const streamClient  = StreamChat.getInstance(apiKey, apiSecret);

// This function fetches the Stream user details for a given userId
export const upsertStreamUser = async (userData) => {
    try{
       await streamClient.upsertUsers([userData]);
        return userData;
    }catch(error){
        console.error("Error in upse")
    }
}


// This function generates a Stream token for a user
export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};
