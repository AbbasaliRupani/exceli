"use client"

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId: string}){

const [socket,setSocket]= useState<WebSocket | null>(null)

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxY2QyYzBhOS1mMjc0LTRkYjQtOTM0NS1kOGZlZGI2OWQ4MDYiLCJpYXQiOjE3OTAzNjQ1MTN9.IHKiYPdo91TFJZjDo_zMXPaDjfaUi75bdd8Llvxf-1s`)

        ws.onopen = ()=>{
            setSocket(ws)
            const data = (JSON.stringify({
                type:"join_room",
                roomId
            }))
            ws.send(data)
        }
    },[roomId])


    if (!socket){
        return <div>
            connecting to the server...
        </div>
    }


    return <div>
        <Canvas roomId = {roomId} socket={socket} />
        
    </div>
}