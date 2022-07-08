import { Request, Response } from "express";
import { encryptPassword, comparePassword } from '../helpers/bcrypt';
//Usuario
import { Usuario, IUsuario, ILogin } from '../models';
import { createToken } from '../helpers/jwt';
import { decode, JwtPayload } from "jsonwebtoken";

export const createUser = async (req: Request<{}, {}, IUsuario>, res: Response) => {
    try {
        const body = req.body;
        const userExists = await Usuario.findByPk(body.rut);
        if (userExists) throw Error('El usuario ya existe');
        const password = encryptPassword(body.clave);
        await Usuario.create({
            rut: body.rut,
            nombre: body.nombre,
            apellido: body.apellido,
            sexo: body.sexo,
            correo: body.correo,
            clave: password,
            celular: body.celular,
            direccion: body.direccion,
            rol: body.rol || 'cliente'
        });

        return res.json({
            msg: 'Usuario creado',
            ok: true
        })
    } catch (error: any) {
        return res.status(400).json({
            msg: error?.message,
            ok: false
        })
    }
}

export const login = async (req: Request<{}, {}, ILogin>, res: Response) => {
    try {
        const { correo, clave } = req.body;

        const userExists = await Usuario.findOne({
            where: {
                correo
            }
        })
        if (!userExists) throw Error('El usuario no existe')

        const { nombre, clave: password, rol } = userExists.get()
        if (!comparePassword(clave, password)) {
            return res.status(400).json({
                msg: 'Correo o clave invalida',
                ok: true
            })
        }
        const token = await createToken(correo, nombre)
        return res.cookie('token', token, { httpOnly: true }).json({
            token: token,
            rol,
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(400).end()
    }
}

export const logout = (req: Request<{}, {}, ILogin>, res: Response) => {
    try {
        return res.clearCookie('token').json({
            ok:true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).end()
    }
}

export const checkRol = async (req: Request, res: Response) => {
    try {
        const token = req.cookies['token'] as string;
        const { args: [correo] } = decode(token) as JwtPayload;
        const user = await Usuario.findOne({
            where: {
                correo
            }
        })
        if (!user) throw Error('El usuario no existe');

        return res.json({
            data: user.get('rol'),
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(404).end()
    }
}

export const checkAttributes = async (req: Request, res: Response) => {
    try {
        const token = req.cookies['token'] as string;
        const { args: [correo] } = decode(token) as JwtPayload;
        const user = await Usuario.findOne({
            where: {
                correo
            }
        })
        if (!user) throw Error('El usuario no existe');

        const { clave,rol, ...args } = user.get();

        return res.json({
            data: args,
            ok: true
        })
    } catch (error) {
        console.log(error);
        return res.status(404).end()
    }
}

export const updateAttributes = async(req:Request,res:Response) => {
    try {
        const token = req.cookies['token'] as string;
        const {} = req.body;
        const {args:[correo]} = decode(token) as JwtPayload;
        const user = await Usuario.findOne({
            where:{
                correo
            }
        })
        if(!user) throw Error('El usuario no existe');
    } catch (error) {
       return res.status(500).end() 
    }  
}