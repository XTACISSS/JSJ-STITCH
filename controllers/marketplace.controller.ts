import {request, Request, Response} from 'express';
import { decode, JwtPayload } from 'jsonwebtoken';
import short  from 'short-uuid';
import { Environment, IntegrationApiKeys, IntegrationCommerceCodes, Options, WebpayPlus } from 'transbank-sdk';
import axios from 'axios';
import { Address, Direccion, IChilexpressCoberturaCalleRequest, IChilexpressCoberturaCalleResponse, IChilexpressCoberturaComunasRequest, IChilexpressCoberturaComunasResponse, IChilexpressCoberturaRegionsResponse, IChilexpressCotizador, IChilexpressCotizadorResponse, Package, Usuario } from '../models';
import { Carrito, Carrito_Poleron, Inventario, Orden, Pago, Poleron } from '../models/products';
import { IPaymentResponse, IPaymentResult } from '../models/webpay';
import { col, fn, literal } from 'sequelize';

export const getProducts = async(req:Request,res:Response) => {
    try {
        const products = await Poleron.findAll();
        return res.json({
            data:products,
            ok:true
        })
    } catch (error) {
        return res.status(500).json({
            ok:false
        })
    }
    
}

export const getProductById = async(req:Request,res:Response) => {
    try {
        const id = req.params.id as string;
        const product = await Poleron.findByPk(id,{
            include:{
                model:Inventario,
                attributes:['cantidad']
            }
        })
        if(!product) throw Error('Ningun producto encontrado');

        return res.json({
            data:product,
            ok:true
        })
    } catch (error) {
        console.log(error)
        return res.status(404).end();
    }
}

export const addToCart = async(req:Request<{},{},{id:number,cantidad?:number}>,res:Response) => {
    try {
        const token = req.cookies['token'] as string;
        const body = req.body
        const {args:[correo,nombre]} = decode(token) as JwtPayload;
        const user = await Usuario.findOne({
            where:{
                correo
            }
        })
        if(!user) throw Error(`Ningun usuario con el correo ${correo}`);
        const [cart] = await Carrito.findOrCreate({
            defaults:{
                total:0
            },
            where:{
                usuario:user.get('rut'),
                pagado:false
            },
            order:[['id','ASC']],
            limit:1
        });
        const [product] = await Carrito_Poleron.findOrCreate({
            defaults:{
                cantidad:0
            },
            where:{
                id_carrito:cart.get('id'),
                id_poleron:body.id
            }
        });
        product.increment('cantidad',{
            by:body.cantidad || 1
        });
        product.save();
        return res.json({
            ok:true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).end()
    }
}

export const removeFromCart = async(req:Request<{},{},{id:number,cantidad?:number}>,res:Response) =>  {
    try {
        const token = req.cookies['token'] as string;
        const body = req.body
        const {args:[correo,nombre]} = decode(token) as JwtPayload;
        const user = await Usuario.findOne({
            where:{
                correo
            }
        })
        if(!user) throw Error(`Ningun usuario con el correo ${correo}`);
        const [cart] = await Carrito.findOrCreate({
            defaults:{
                total:0
            },
            where:{
                usuario:user.get('rut'),
                pagado:false
            },
            order:[['id','ASC']],
            limit:1
        });
        const product = await Carrito_Poleron.findOne({
            where:{
                id_carrito:cart.get('id'),
                id_poleron:body.id
            }
        })
        if(!product) throw Error('No existe el producto en el carrito');

        product.decrement('cantidad',{
            by:body?.cantidad || 1
        })
        if(product.get('cantidad') as number < 1){
            product.destroy()
        }
        product.save()
        return res.json({
            ok:true
        })
    } catch (error) {
        console.log(error)
        return res.status(404).end()
    }
}

export const deleteFromCart = async(req:Request<{},{},{id:number}>,res:Response) =>{
    try {
        const token = req.cookies['token'] as string;
        const body = req.body;
        const {args:[correo,nombre]} = decode(token) as JwtPayload;
        const user = await Usuario.findOne({
            where:{
                correo
            }
        })
        if(!user) throw Error(`Ningun usuario con el correo ${correo}`);
        const cart = await Carrito.findOne({
            where:{
                usuario:user.get('rut'),
                pagado:false
            },
            order:[['id','ASC']],
            limit:1
        });
        if(!cart) throw Error('Ningun producto en el carrito');

        await Carrito_Poleron.destroy({
            where:{
                id_poleron:body.id,
                id_carrito:cart.get('id')
            }
        })
        Carrito_Poleron.afterSave
        return res.json({
            ok:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).end()
    }
}

export const getCart = async(req:Request,res:Response) => {
    try {
        const token = req.cookies['token'] as string;
        const {args:[correo,nombre]} = decode(token) as JwtPayload;
        const user = await Usuario.findOne({
            where:{
                correo
            }
        })
        if(!user) throw Error(`Ningun usuario con el correo ${correo}`);
        const [cart] = await Carrito.findOrCreate({
            defaults:{
                total:0
            },
            where:{
                usuario:user.get('rut'),
                pagado:false
            },
            order:[['id','ASC']],
            limit:1,
            include:[
                {
                    model:Poleron
                }
            ]
        })
        return res.json({
            data:cart.get(),
            ok:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}

export const createDesign = async(req:Request,res:Response) => {

}

export const calcShipment = async(req:Request<{},{},{},{county:string}>,res:Response) => {
    try {
        const token = req.cookies['token'] as string;
        const {args:[correo,nombre]} = decode(token) as JwtPayload;
        const { county } = req.query
        const user = await Usuario.findOne({
            where:{
                correo
            }
        })
        if(!user) throw Error(`Ningun usuario con el correo ${correo}`);

        const cart = await Carrito.findOne({
            where:{
                usuario:user.get('rut'),
                pagado:false
            },
            order:[['id','ASC']],
            limit:1
        })

        if(!cart) throw Error('Ningun carrito encontrado');
        const productos = await Carrito_Poleron.findOne({
            attributes:[
                [fn('sum',col('cantidad')), 'cantidad']
            ],
            where:{
                id_carrito:cart.get('id')
            }
        });
        const cantidad = productos?.get('cantidad') as number;
        let order:IChilexpressCotizador= {
            package:{
                weight: (cantidad * 0.500).toString(),
                height:(cantidad * 10).toString(),
                length:"40",
                width:"40"
            },
            deliveryTime: 2,
            declaredWorth: (15000 * cantidad).toString(),
            productType: 3,
            originCountyCode: 'STGO',
            destinationCountyCode:county,
            contentType:1
        }
        const response = await axios.post<IChilexpressCotizadorResponse>('https://testservices.wschilexpress.com/rating/api/v1/rates/courier',{
            ...order
        },{
            headers:{
                'Ocp-Apim-Subscription-Key':process.env.CHILEXPRESS_COTIZADOR!
            }
        })
        return res.json({
            data:response.data.data,
            ok:true
        })
    } catch (err:any) {

        return res.status(401).json({
            ok:false
        })
    }
}

export const getRegions = async(req:Request,res:Response) => {
    try {
        const body = req.body;
        const response = await axios.get<IChilexpressCoberturaRegionsResponse>('https://testservices.wschilexpress.com/georeference/api/v1/regions',{
            headers:{
                'Ocp-Apim-Subscription-Key':process.env.CHILEXPRESS_COBERTURA!
            }
        })
        return res.json({
            data:response.data.regions,
            ok:true
        })
    } catch (err:any) {

        return res.status(401).json({
            ok:false
        })
    }
}

export const getComunas = async(req:Request<{},{},{},IChilexpressCoberturaComunasRequest>,res:Response) => {
    try {
        const { RegionCode, type} = req.query;
        const response = await axios.get<IChilexpressCoberturaComunasResponse>('https://testservices.wschilexpress.com/georeference/api/v1/coverage-areas',{
            headers:{
                'Ocp-Apim-Subscription-Key':process.env.CHILEXPRESS_COBERTURA!
            },
            params:{
                'RegionCode':RegionCode,
                'type':type || 1
            }
        })
        return res.json({
            data:response.data.coverageAreas,
            ok:true
        })
    } catch (err:any) {
        console.log(err)
        return res.status(401).json({
            ok:false
        })
    }
}

export const getCalles = async(req:Request<{},{},{},IChilexpressCoberturaCalleRequest>,res:Response) => {
    try {
        const body = req.query;
        const response = await axios.post<IChilexpressCoberturaCalleResponse>('https://testservices.wschilexpress.com/georeference/api/v1/streets/search',{
        ...body
        },{
            headers:{
                'Ocp-Apim-Subscription-Key':process.env.CHILEXPRESS_COBERTURA!
            },
            params:{
                'limit':10
            }
        })
        return res.json({
            data:response.data.streets,
            ok:true
        })
    } catch (err:any) {
        console.log(err)
        return res.status(401).json({
            ok:false
        })
    }
}

export const initPayTransbank = async(req:Request<{},{},any>,res:Response) => {
    try {
        const token = req.cookies['token'] as string;
        const  {body:{envio, detalles} } = req.body;
        const {args:[correo,nombre]} = decode(token) as JwtPayload;
        const user = await Usuario.findOne({
            where:{
                correo
            }
        })
        if(!user) throw Error('El usuario no existe');
    
        const cart = await Carrito.findOne({
            where:{
                usuario:user.get('rut'),
                pagado:false
            },
            order:[['id','ASC']],
            limit:1,
            attributes:['id','total']
        })
    
        if(!cart) throw Error('Ningun carrito encontrado');
        const total = cart.get('total') as number
        await Orden.findOrCreate({
            defaults:{
                region:detalles.region,
                comuna:detalles.comuna,
                calle:detalles.direccion + ' ' + detalles.numeracion,
                costo_envio:envio
            },
            where:{
                id_carrito:cart.get('id')
            }
        })
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        const buyOrder = short.generate();
        const session = req.sessionID;
        const response:IPaymentResponse = await tx.create(buyOrder, session, total + (envio ||0), 'http://localhost:4200/pay');
        return res.json({
            token:response.token,
            url:response.url
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false
        })
    }
} 

export const getTransactionDetails = async(req:Request,res:Response) => {
    try {
        const token = req.query.token as string; 
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        const response:IPaymentResult = await tx.status(token);

        const cart = await Pago.findOne({
            where:{
                orden_compra: response.buy_order
            },
            include:[
                {
                    model:Carrito,
                    foreignKey:'id_carrito',
                    required:true,
                    include:[
                        {
                            model:Poleron
                        },
                        {
                            model:Orden,
                            foreignKey:'id_carrito'
                        }
                    ]
                }
            ]
        })
        return res.json({
            data:{
                transaction:response,
                cart:cart
            },
            ok:true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).end()
    }   
}

export const confirmPayment = async(req:Request,res:Response) => {
    try {
        const token_ws = req.query.token_ws as string;
    const token = req.cookies['token'] as string;
    const {args:[correo,nombre]} = decode(token) as JwtPayload;
    const user = await Usuario.findOne({
        where:{
            correo
        }
    })
    if(!user) throw Error('El usuario no existe');
    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    const response:IPaymentResult = await tx.commit(token_ws);
    if(response.response_code != 0 && response.status !== 'AUTHORIZED'){
        return res.status(403).end()
    }
    const cart = await Carrito.findOne({
        where:{
            usuario:user.get('rut'),
            pagado:false
        },
        order:[['id','ASC']],
        limit:1
    })
    if(!cart) throw Error('Ningun carrito encontrado')

    await Pago.create({
        orden_compra:response.buy_order,
        metodo_pago:response.payment_type_code,
        id_carrito:cart?.get('id')
    })

    cart.set('pagado',true)
    await cart.save()
    return res.json({
        data:{
            transaction_details:response,
            cart:cart?.get()
        },
        ok:true
    })
        
    } catch (error) {
        console.log(error)
        return res.status(500).end()
    }
    
}
