import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY and STREAM_API_SECRET Missing.");
}

const streamClient  = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try{

        await streamClient.upsertUsers([userData]);
        return userData;
    }catch(error){
        console.error("Error in upse")
    }
}


export const generateStreamToken = (userId) => {};