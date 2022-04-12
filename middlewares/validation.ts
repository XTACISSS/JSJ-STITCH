import { NextFunction, Request, Response } from "express";
import { validationResult, CustomValidator } from "express-validator";
//Firebase
import firebaseApp from '../firebase';
const auth = firebaseApp.Auth;

export const verifyToken:CustomValidator = (token: string) =>{
  const result = auth.verifyIdToken(token,true)
  .then(() =>{
    return true;
  })
  .catch((err) => {
    throw err.message;
  })
  return result;
}

export const handlerErrorResult = (req: Request,res: Response,next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors,
    });
  }
  next();
};
