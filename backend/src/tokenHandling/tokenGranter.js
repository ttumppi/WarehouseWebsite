import { create, verify, decode, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts"

const secretKey = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  )

let tokenID = 0



export const CreateToken = async (username, expiration) => {

    const ID = tokenID
    tokenID = tokenID + 1

    return await create({ alg: "HS512", typ: "JWT" },
         { username: `${username}`,
        exp: getNumericDate(expiration),
        id: ID },
          secretKey);
}

export const VerifyAndGetToken = async (token) => {

    try{
        const decodedToken = await verify(token, secretKey)
        return {success: true, token: decodedToken}
    }

    catch(error){
        return {success: false, message: error}
    }
    
}