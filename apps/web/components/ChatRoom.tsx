import axios from "axios"
import { BACKEND_URL } from "../app/config"
import { ChatRoomClient } from "./ChatRoomClient";
import { cookies } from "next/headers";

async function getChats(roomId:string){
    const token = (await cookies()).get("token")?.value; 
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`,
       { headers:{
            Authorization :token ?? "",
        },}
    );
    return response.data.messages
}

export async function ChatRoom({id}:{
    id:string
}){
    const messages = await getChats(id);
    return <ChatRoomClient id={id} messages={messages}/>
}