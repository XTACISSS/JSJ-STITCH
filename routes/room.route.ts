import { Router } from "express";
import { header,body, check } from "express-validator";
import { createRoom,getRoom,getMessages } from "../controllers/room.controller";
import { handlerErrorResult, verifyToken } from "../middlewares/validation";

const router = Router();

router.get('/:id',
  [
    header('x-token').notEmpty().bail().custom(verifyToken),
    check('id','not valid room object').not().isEmpty(),
    handlerErrorResult
  ],
getRoom
)
router.get('/messages/:room',
  [
    check('x-token').notEmpty().bail().custom(verifyToken),
    check('room','not valid room object').not().isEmpty(),
    handlerErrorResult
  ],
getMessages
)

router.post(
  "/newRoom",
  [
    header('x-token').notEmpty().bail().custom(verifyToken),
    body("name",'not valid room object').not().isEmpty(),
    handlerErrorResult],
  createRoom
);

export default router;