import * as tokenReader from "./tokenReader.js"
import * as tokenGranter from "./tokenGranter.js"

const unvalidatedTokens = []

export const VerifyAndGetTokenFromHeaders = async (headers) => {

    const result = await tokenReader.VerifyAndGetToken(headers)

    if (!result.success){
        return {success:false}
    }

    console.log(JSON.stringify(unvalidatedTokens));
    console.log(result.token.ID);
    if (unvalidatedTokens.indexOf(result.token.ID) != -1){
        return {success:false}
    }

    return result
}

export const CreateToken = async (username, role, expiration) => {

    return await tokenGranter.CreateToken(username, role, expiration)
}

export const VerifyAndGetToken = async (token) => {

    if (unvalidatedTokens.indexOf(token.id) != -1){
        return {success:false, message:"login required"}
    }

    return await tokenGranter.VerifyAndGetToken(token)
}

export const InvalidateToken = async (token) => {

    unvalidatedTokens.push(token.id)
}