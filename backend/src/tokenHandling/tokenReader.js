import * as tokenGranter from "./tokenGranter.js"

export const VerifyAndGetToken = async (headers) => {
    const cookie = headers.get("Cookie")

    if (!cookie){
        return {success:false}
    }

    const token = GetTokenFromHeader(cookie)

    if (!token){
        return {success:false}
    }

    return tokenGranter.VerifyAndGetToken(token)

}


const GetTokenFromHeader = (header) => {
    return ParseCookie(header, "Bearer ")
}

const ParseCookie = (cookieHeader, stringToSplitOn) => {
    const index = cookieHeader.indexOf(stringToSplitOn[stringToSplitOn.length -1])
    return cookieHeader.slice(index +1)
}