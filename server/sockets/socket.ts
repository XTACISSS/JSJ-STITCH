import { Server, Socket as SocketIO } from "socket.io";
import { ClientToServerEvents, InterServerEvents,ServerToClientEvents, SocketData } from './events';

import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { getDoc, roomConverter } from '../../firebase/firestore';

import { Room, Message } from '../../models/room';

const db = getFirestore();

const Socket = (server:Server<ClientToServerEvents,ServerToClientEvents,InterServerEvents,SocketData>) =>{
    server.on("connect",(client:SocketIO<ClientToServerEvents>)=>{
        let messages:Message[];
        //on events
        client.on('createRoom', async(roomName,callback: any) => {
            if(server.sockets.adapter.rooms.get(roomName)){
                callback(null)
            }else{
                if(!await getDoc('Rooms',roomName)){
                    const newRoom = {name:roomName,messages:[]}
                    db.collection('Rooms').doc(roomName).withConverter(roomConverter).set(newRoom)
                    client.join(newRoom.name);
                    callback(newRoom)
                }else{
                    callback(null)
                }
            }
        });
        client.on('searchRoom', async(roomName:string,callback:any) => {
            const room = db.collection('Rooms').doc(roomName).get().then((result) => result.data() as Room)
            callback(await room)
        });
        client.on("joinRoom", async(user:any,roomName:string,callback:any) => {
            let room = await db.collection('Rooms').doc(roomName).get().then((result) => result.data() as Room)
            if(room){
                messages = room.messages;
                client.join(roomName)
                client.leave(client.id)
                callback(room)
                server.to(roomName).emit('userJoined',user)
            }else{
                callback(null)
            }
        });
        client.on('newMessage',(newMessage:Message) => {
            const [room] = client.rooms;
            //Consumes one operation by message NOT recommended
            const roomRef = db.collection('Rooms').doc(room)
            roomRef.update({messages:FieldValue.arrayUnion(newMessage)})
            server.to(room).emit('newMessage',newMessage)
        })
        client.on('leaveRoom',(user,roomName) => {
            server.to(roomName).emit('userLeft',user)
        })
        client.on('disconnecting' , () => {
            const [room] = client.rooms
        })
    })
}

const backupMessages = (server:Server,roomName:string) => {
    const room = server.sockets.adapter.rooms.get(roomName)
    console.log(roomName)
    if(room){
        console.log('Existe la sala',[room])
        if(room.size <= 1){
            console.log('No hay usuarios')
            return true
        }
    }
    return false
}

export default Socket;
