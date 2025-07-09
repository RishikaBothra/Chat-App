import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080, host: "0.0.0.0" });


let userCount = 0;
let allSockets: WebSocket[] = [];

wss.on("connection",(socket) =>{
    allSockets.push(socket);

    userCount++;
    console.log("user count:", userCount);

    socket.on("message",(message) =>{
        console.log("msg:",message.toString()," from user:", userCount);
        for (let i = 0; i < allSockets.length; i++) {
            allSockets[i].send(message.toString() + " from user: " + userCount);
        }
    })
})