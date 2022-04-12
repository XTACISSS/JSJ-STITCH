//Express Types
import { Response, Request } from 'express';
//Firebase
import {DocumentData } from "firebase/firestore";
import {getFirestore} from 'firebase-admin/firestore'
//Model reference
import {Room} from "../models";
//Firebase store
import { getDoc, uploadDoc, getAllDocs } from '../firebase/firestore';

const db = getFirestore();

const createRoom = async(req:Request,res:Response) =>{
    const data:Room = req.body;
    const room = await getDoc('Rooms',data.name);
    if(room){
        return res.status(400).json({
            msg:'The room already exists',
            room:{}
        });
    }
    data.messages = []
    const result:DocumentData | null = await uploadDoc('Rooms',data,data.name);
    if(!result){
        return res.status(500).json({
            msg:'Can not create the room',
            room:{}
        })
    }

    return res.json({
        room:result
    });
}

const getRoom = async(req:Request, res:Response) => {
    const {id} = req.params;
    // const room:DocumentData[] | undefined = await getAllDocs('Rooms',id);
    const room = await db.collection('Rooms').doc(id).get()
    if(!room.exists){
        return res.status(404).json({
            msg:`No room with the name ${id}`,
            data:{}
        })
    }
    return res.json({
        data : room.data()
    })
}

const getMessages = async(req:Request,res:Response) =>{
    const {room} = req.params; 
    const messages:DocumentData[] | undefined = await getAllDocs('Rooms',room);
    if(!messages){
        return res.status(400).json({
            msg:`No messages in the room ${room}`,
            data:[]
        })
    }
    return res.json({
        data : messages
    })
}

export {
    createRoom,
    getMessages,
    getRoom
};