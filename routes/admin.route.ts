import { Router } from "express";
import { body, param,query } from "express-validator";
import multer, { diskStorage } from "multer";
import { deletePoleron, getPoleron, newPoleron, updatePoleron, updateStock} from "../controllers/admin.controller";
import { handlerErrorResult } from "../middlewares/validation";

const router = Router();
const upload = multer({
    storage:diskStorage({
        destination:'uploads/designs',
        filename(req, file, callback) {
            callback(null, file.originalname);
        },
    }),
})

router.get('/Poleron',
[
    query('id','campo obligatorio'),
    handlerErrorResult
],getPoleron)

router.post('/Poleron',
[
    upload.single('img'),
    body(['color','talla','disenio','precio'],'campo obligatorio').notEmpty(),
    body('talla').toUpperCase().isIn(['XS','S','M','L','XL']),
    body('precio').isNumeric(),
    handlerErrorResult
],newPoleron
);

router.delete('/Poleron/:id',
[
    param('id').notEmpty().bail().isNumeric(),
    handlerErrorResult
],deletePoleron)

router.put('/Poleron',[
    upload.any(),
    handlerErrorResult
],updatePoleron)

router.put('/Stock',[
    body(['id','cantidad']).notEmpty().isNumeric(),
    handlerErrorResult
],updateStock)

export default router;