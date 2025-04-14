import jwt from "jsonwebtoken"
import * as readFile from "../readFile.js"
import * as path from "path"


const tokenFolderPath = path.dirname(new URL(import.meta.url).pathname);

const signKeyPath = path.join(tokenFolderPath, "key.spec")

const signKey = await readFile(signKeyPath);





let tokenID = 0



export const CreateToken = async (username, expirationSeconds) => {

    const ID = tokenID;
    tokenID++;

    return jwt.sign(
        {
        username,
        ID
        }, 
    signKey,
     { expiresIn: expirationSeconds});
}

export const VerifyAndGetToken = async (token) => {

    try{
        const decodedToken = jwt.verify(token, signKey);
        return {success: true, token: decodedToken}
    }

    catch(error){
        return {success: false, message: error}
    }
    
}