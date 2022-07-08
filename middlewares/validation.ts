import { NextFunction, Request, Response } from "express";
import { validationResult, CustomValidator } from "express-validator";
import { verify } from 'jsonwebtoken';

export const verifyToken:CustomValidator = (token: string) =>{
  const result = verify(token,process.env.JWT_KEY!)
  if(!result){
    throw Error('Token de acceso inválido')
  }
  return true
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
