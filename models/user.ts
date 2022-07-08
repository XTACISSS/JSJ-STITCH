import { sequelize, DataTypes } from '../db';
import { Carrito } from './products';

export const Usuario = sequelize.define('usuario',{
    rut:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    apellido:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    sexo:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    correo:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isEmail:true
        }
    },
    clave:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    celular:{
        type:DataTypes.BIGINT,
        allowNull:false,
    },
    direccion:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    rol:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:'cliente'
    }
},{
    freezeTableName:true,
    createdAt:false,
    updatedAt:false
})

Usuario.hasOne(Carrito,{
    foreignKey:'usuario',
    as:'usuario_fk'
});
Carrito.belongsTo(Usuario,{
    foreignKey:'usuario',
    as:'carrito_fk'
});
//-----------------------------INTERFACES---------------------------//
export interface IUsuario {
    rut:number;
    nombre:     string;
    apellido:   string;
    sexo:       string;
    correo:     string;
    clave:      string;
    celular:    number;
    direccion:  string;
    rol:        string;
} 

export interface ILogin{
    correo: string;
    clave:  string;
}