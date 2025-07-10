import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080, host: "0.0.0.0" });

interface User{
    socket: WebSocket;
    room:string;
}
let userCount = 0;
let allSockets: User[] = [];

wss.on("connection",(socket) =>{

    socket.on("message",(message) =>{

        const parsedMessage = JSON.parse(message as unknown as string);
        if(parsedMessage.type == "join") {
            allSockets.push({
                socket,
                room:parsedMessage.payload.roomId
            })
        }
        if(parsedMessage.type == "message"){
            // const currentUserRoom = allSockets.find((x) =>x.socket == socket).room;
            let currentUserRoom = null;
            for(let i = 0; i < allSockets.length; i++) {
                if(allSockets[i].socket === socket) {
                    currentUserRoom = allSockets[i].room;
                    break;
                }
            }
            for(let i = 0; i < allSockets.length; i++) {
                if(allSockets[i].room === currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    })
//     socket.on("disconnect",() =>{
//         allSockets = allSockets.filter(x=>x!=socket);
//         userCount--;
//         console.log("user count:", userCount);
//     })
})