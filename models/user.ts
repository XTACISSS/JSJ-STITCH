import {UserCredential} from 'firebase/auth'

export interface User extends UserCredential{
    username:string;
}