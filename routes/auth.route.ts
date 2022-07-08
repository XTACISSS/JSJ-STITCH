import { Router } from "express";
import { body, cookie } from "express-validator";
import { checkAttributes, checkRol, createUser, login, logout } from "../controllers/auth.controller";
import { handlerErrorResult, verifyToken } from "../middlewares/validation";

const router = Router();

router.post('/createUser',
  [
    body('rut','campo obligatorio').not().isEmpty().bail().isInt({min:99999999,max:999999999}).withMessage('Rut invalido'),
    body('correo','campo obligatorio').not().isEmpty().bail().isEmail(),
    body('clave','campo obligatorio').not().isEmpty().bail().isStrongPassword({minLength:8}).withMessage('Contraseña insegura'),
    body('sexo','campo obligatorio').not().isEmpty().bail().toUpperCase().isIn(['MASCULINO','FEMENINO','OTRO']).withMessage('genero inválido'),
    body(['nombre','apellido','direccion'],'campo obligatorio').not().isEmpty(),
    body('celular','campo invalido').not().isEmpty().bail().isMobilePhone('es-CL'),
    handlerErrorResult
  ],createUser
)

router.post('/login',
  [
    body('correo','campo obligatorio').notEmpty().bail().isEmail(),
    body('clave','campo obligatorio').notEmpty(),
    handlerErrorResult
  ],login)

router.get('/logout',[
  cookie('token','ningun token encontrado').notEmpty(),
  handlerErrorResult
],logout)

router.get('/rol',[
  cookie('token','ningun token encontrado').notEmpty(),
  handlerErrorResult
],checkRol)

router.get('/',[
  cookie('token','ningun token encontrado').notEmpty(),
  handlerErrorResult
],checkAttributes)


export default router