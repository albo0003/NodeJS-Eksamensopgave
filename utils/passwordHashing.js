import bcrypt from 'bcrypt';

const saltRounds = 14;

export async function hashPassword(password){
    return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(password, passwordAlreadyHashed){
     return await bcrypt.compare(password, passwordAlreadyHashed);
}