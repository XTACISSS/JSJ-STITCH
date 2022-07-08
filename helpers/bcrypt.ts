import bcrypt from 'bcrypt';

export const encryptPassword = (password:string):string => {
    const salt = bcrypt.genSaltSync(10);
    return  bcrypt.hashSync(password,salt);
}

export const comparePassword = (password:string, hash:string):boolean => {
    return bcrypt.compareSync(password,hash)
}