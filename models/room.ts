import {v4 as uuid} from 'uuid';
import { Observable,EMPTY } from 'rxjs';
import { getFirestore } from 'firebase-admin/firestore';
// import { getAllDocs } from '../firebase/firestore';
//User model
import { User } from "./user";

const db = getFirestore();

export interface Message{
    from:User,
    to?:User,
    body:string,
    createdAt:Date
}

export interface Room{
    name:string;
    messages : Message[]
}