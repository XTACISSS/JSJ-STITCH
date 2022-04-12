import { Router } from "express";
import { header,body, check } from "express-validator";
import { createUser } from "../controllers/auth.controller";
import { handlerErrorResult, verifyToken } from "../middlewares/validation";

const router = Router();

router.post('/createUser',
  [
    body('email','not valid user object').not().isEmpty().bail().isEmail(),
    body('password','not valid user object').not().isEmpty(),
    handlerErrorResult
  ],
createUser
)

export default router