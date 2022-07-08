import { sequelize,DataTypes } from '../db';

export const Poleron = sequelize.define('poleron',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    color:{
        type:DataTypes.CHAR,
        allowNull:false
    },
    img:{
        type:DataTypes.BLOB,
        allowNull:false
    },
    talla:{
        type:DataTypes.STRING,
        allowNull:false
    },
    disenio:{
        type:DataTypes.CHAR,
        allowNull:false
    },
    precio:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    oferta:{
        type:DataTypes.BIGINT,
        allowNull:true,
        defaultValue:0
    }
},{
    freezeTableName:true,
    createdAt:false,
    updatedAt:false
});


export const Carrito = sequelize.define('carrito_compra',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    total:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    pagado:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
    }
    
},{
    freezeTableName:true,
    createdAt:false,
    updatedAt:false
})

export const Carrito_Poleron = sequelize.define('carrito_producto',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    id_carrito:{
        type:DataTypes.INTEGER,
        references:{
            model:Carrito,
            key:'id'
        }
    },
    id_poleron:{
        type:DataTypes.INTEGER,
        references:{
            model:Poleron,
            key:'id'
        }
    },
    cantidad:{
        type:DataTypes.INTEGER
    }
},{
    freezeTableName:true,
    createdAt:false,
    updatedAt:false
})

Carrito.belongsToMany(Poleron,{
    through:Carrito_Poleron,
    foreignKey:'id_carrito',
    onDelete:'CASCADE'
})

Poleron.belongsToMany(Carrito,{
    through:Carrito_Poleron,
    foreignKey:'id_poleron',
    onDelete:'CASCADE'
})

export const Inventario = sequelize.define('inventario',{
    id_inventario:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    id_poleron:{
        type:DataTypes.INTEGER,
        references:{
            model:Poleron,
            key:'id'
        }
    },
    cantidad:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    freezeTableName:true,
    createdAt:false,
    updatedAt:false
})

Poleron.hasOne(Inventario,{
    foreignKey: 'id_poleron'
})

Inventario.belongsTo(Poleron,{
    foreignKey:'id_poleron'
})

export const Orden = sequelize.define('ordenes',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    id_carrito:{
        type:DataTypes.INTEGER,
        references:{
            model:Carrito,
            key:'id'
        }
    },
    region:{
        type:DataTypes.STRING,
        allowNull:false
    },
    comuna:{
        type:DataTypes.STRING,
        allowNull:false
    },
    calle:{
        type:DataTypes.STRING
    },
    costo_envio:{
        type:DataTypes.BIGINT
    }
},{
    freezeTableName:true,
    createdAt:false,
    updatedAt:false
})

Orden.belongsTo(Carrito,{
    foreignKey:'id'
})

Carrito.hasOne(Orden,{
    foreignKey:'id_carrito'
})

export const Pago = sequelize.define('pago',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    orden_compra:{
        type:DataTypes.STRING,
        allowNull:false
    },
    metodo_pago:{
        type:DataTypes.CHAR,
        allowNull:false
    },
    id_carrito:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Carrito,
            key:'id'
        }
    }
},{
    freezeTableName:true,
    createdAt:false,
    updatedAt:false
})

Carrito.hasOne(Pago,{
    foreignKey:'id'
})

Pago.belongsTo(Carrito,{
    foreignKey:'id_carrito'
})

//-----------------------------INTERFACES---------------------------//
export interface IPoleron{
    id:number;
    color:string;
    talla:string;
    disenio:number;
    img?:string;
    precio:number;
}

export interface ICarrito{
    id:number;
    cantidad:number
}

export interface IGetCartResponse {
    data: Cart;
    ok:   boolean;
}

export interface Cart {
    id:       number;
    total:    number;
    usuario:  number;
    polerons: Poleron[];
}

export interface Poleron {
    precio:           number;
    carrito_producto: CarritoProducto;
}

export interface CarritoProducto {
    id:         number;
    id_carrito: number;
    id_poleron: number;
    cantidad:   number;
}
