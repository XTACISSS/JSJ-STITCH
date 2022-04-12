import jwt, { JwtPayload, verify } from 'jsonwebtoken';

export const createToken = (id:string = ''):Promise<string | undefined> => {
    return new Promise((resolve,reject) =>{
        const payload = {id};
        jwt.sign(payload,process.env.JWT_KEY!,{
            expiresIn:'4h'
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
