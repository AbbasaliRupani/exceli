import { useEffect,useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket(){
    const [loading, setLoading] = useState (true);
    const [socket, setSocket]= useState<WebSocket>();

    useEffect(()=>{
       const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NjIxNTE4MC1iMGVlLTQyYTctYWU5ZC1jMDdjNTBkNWU3ZjciLCJpYXQiOjE3ODk2NzU5MzB9.UupU3SabdtvpjEiv5EwhnUfM_s6EQlhxfZAiFzUG7kU`);
       ws.onopen = ()=>{
        setLoading(false);
        setSocket(ws);
       }
    },[]);

    return {
        socket,
        loading
    }
}

