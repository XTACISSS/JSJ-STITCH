import { Request, Response, Express } from 'express';
import { Inventario, IPoleron, Poleron } from '../models';

export const getPoleron = async (req: Request, res: Response) => {
    try {
        const id = req.query.id as string;
        if (id) {
            const producto = await Poleron.findByPk(id, {
                include: [{
                    model: Inventario,
                    foreignKey:'id_poleron'
                }]
            });
            return res.json({
                data: producto,
                ok: true
            })
        } else {
            const productos = await Poleron.findAll({
                include: [{
                    model: Inventario,
                    foreignKey:'id_poleron'
                }]
            }
            );
            return res.json({
                data: productos,
                ok: true
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(404).end()
    }
}

export const newPoleron = async (req: Request<{}, {}, IPoleron>, res: Response) => {
    try {
        let body = req.body;
        if (req.file) {
            body.img = req.file.path
        }
        const poleron =await Poleron.create({
            ...body
        })
        return res.json({
            msg: 'Nuevo poleron creado',
            data: poleron,
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false
        })
    }
}

export const deletePoleron = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const poleron = await Poleron.findByPk(id);
        if (!poleron) throw Error('Ningun poleron con ese id')

        await poleron.destroy()
        return res.json({
            ok: true
        })
    } catch (error) {
        console.log(error);
        return res.status(404).end()
    }

}

export const updatePoleron = async (req: Request<{}, {}, IPoleron>, res: Response) => {
    try {
        const { id, ...args } = req.body
        if (req.file ?? req.files) {
            if (req.file) {
                args.img = req.file.path
            } else if (req.files && req.files?.length > 0) {
                const files = req.files as Express.Multer.File[];
                args.img = files[0].path;
            } else {
                delete args.img;
            }
        }
        const product = await Poleron.findByPk(id);
        if (!product) throw Error('No existe el poleron')

        await product.update(args)
        return res.json({
            data: args,
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(404).end()
    }
}

export const getStock = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const stock = await Inventario.findOne({
            where: {
                id_poleron: id
            }
        });
        if (!stock) throw Error('Ningun stock encontrado');
        return res.json({
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(404).end()
    }
}

export const updateStock = async (req: Request, res: Response) => {
    try {
        const { id, ...args } = req.body;
        const stock = await Inventario.findOne({
            where: {
                id_poleron: id
            }
        });
        if (!stock) throw Error('Ningun stock encontrado');
        console.log(stock)
        await stock.update(args)
        return res.json({
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(404).end()
    }
}