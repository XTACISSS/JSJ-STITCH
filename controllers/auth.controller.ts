import {v4 as uid} from 'uuid';
import { Request, Response } from "express";
import firebaseApp from "../firebase";

export const createUser = async(req:Request,res:Response) => {
    const {email,password} = req.body
    firebaseApp.Auth.getUserByEmail(email)
    .then((user) => {
        return res.status(400).json({
            msg:'The email is already in use'
        })
    }).catch((err)=>{
        if(err.errorInfo.code === 'auth/user-not-found'){
            firebaseApp.Auth.createUser({
                uid: uid(),
                email,
                password
            }).then((user) => {
                res.json({
                    user
                })
            })
            .catch(()=>{
                res.status(500).json({
                    msg:'The user cannot be created'
                }
                )
            })
        }
    })
}

export const updateUser = (req:Request,res:Response) => {

}