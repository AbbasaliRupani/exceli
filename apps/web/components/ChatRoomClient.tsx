"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}:{messages:{message:string}[];
    id:string
}){
    const [chats, setChats] =useState<{ id?: number; message: string }[]>(messages);
    const [currentMessage,setCurrentMessage]= useState("");
    const {socket,loading} =useSocket();
    

    useEffect(()=>{
        if(socket && !loading){
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))
            socket.onmessage = (e)=>{
                const parsedData = JSON.parse(e.data);
                if(parsedData.type === "chat"){

                    setChats(c =>[...c,{message:parsedData.message}])
                }

            }
        }
    },[socket,loading,id])

    return <div>

        {/* {chats.map(m=><div>{m.message}</div>)} */}
    {chats.map((m, i) => (
    <div key={m.id ?? `new-${i}`}>{m.message}</div>
))}

        <input type="text" value={currentMessage} onChange={e=>{
            setCurrentMessage(e.target.value)
        }}></input>
        <button onClick={()=>{
            socket?.send(JSON.stringify({
                type:"chat",
                roomId :id,
                message: currentMessage
            }))
            setCurrentMessage("");
        }}>
            Send Message
        </button>
    </div>
}