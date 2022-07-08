import jwt, { JwtPayload, verify } from 'jsonwebtoken';

export const createToken = (...args:string[]):Promise<string | undefined> => {
    return new Promise((resolve,reject) =>{
        const payload = {args};
        jwt.sign(payload,process.env.JWT_KEY!,{
            expiresIn:'6h'
        },(err,token) =>{
            if(err){
                console.log(err)
                reject('The token was not created')
            }else{
                resolve(token)
            }
        })
    })
}

export const getUserInfo = (token:string): Promise<null> => {
    return new Promise((resolve) => {
        
    })
}
