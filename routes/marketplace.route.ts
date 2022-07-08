import {  Router } from "express";
import { body, cookie,query,param } from "express-validator";
import multer, { diskStorage } from "multer";
import { newPoleron } from "../controllers/admin.controller";
import { addToCart,removeFromCart, initPayTransbank, getCart, confirmPayment, deleteFromCart, calcShipment, getProducts, getProductById, getRegions, getComunas, getCalles, getTransactionDetails } from "../controllers/marketplace.controller";
import { handlerErrorResult } from "../middlewares/validation";

const router = Router();

const upload = multer({
  storage:diskStorage({
      destination:'uploads/custom',
      filename(req, file, callback) {
          callback(null, file.originalname);
      },
  }),
})

router.get('/',getProducts);

router.post('/product',[
  upload.single('img'),
  handlerErrorResult
],newPoleron)

router.get('/product/:id',
[
  param('id','campo obligatorio').notEmpty().bail().isNumeric(),
  handlerErrorResult
]
,getProductById);

router.get('/cart',[
  cookie('token').notEmpty().withMessage('Ningun token de acceso'),
  handlerErrorResult
],getCart
);

router.post('/addCart',
  [
    cookie('token').notEmpty().withMessage('Ningun token de acceso'),
    body('id','campo obligatorio'),
    handlerErrorResult
  ],addToCart
);

router.post('/removeCart',
  [
    cookie('token').notEmpty().withMessage('Ningun token de acceso'),
    body('id','campo obligatorio'),
    handlerErrorResult
  ],removeFromCart
);

router.delete('/cart',
  [
    cookie('token').notEmpty().withMessage('Ningun token de acceso'),
    body('id','campo obligatorio'),
    handlerErrorResult
  ],deleteFromCart
);

//API

router.get('/regions',getRegions);

router.get('/comunas',[
  query('RegionCode','Parametro obligatorio').notEmpty(),
  handlerErrorResult
],getComunas);

router.get('/calles',[
  query(['countyName','streetName'],'campo obligatorio').notEmpty(),
  handlerErrorResult
],getCalles);

router.get('/shipment',[
  query('county','campo obligatorio').notEmpty(),
  handlerErrorResult
],calcShipment)

router.post('/pay',[
  cookie('token','ningun token de acceso').notEmpty(),
  body(['envio','detalles']).optional().isNumeric(),
  handlerErrorResult
],initPayTransbank);

router.get('/pay/details',[
  query('token').notEmpty(),
  handlerErrorResult
],getTransactionDetails)

router.get('/payed',confirmPayment)

export default router;