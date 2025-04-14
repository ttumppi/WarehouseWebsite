import * as dbHandler from "../db/dbHandler.js"
import * as tokenSystem from "../tokenHandling/tokenSystem.js"

export const CorrectLogin = async (req, res) => {

    const usernameResult = await dbHandler.GetUser(req.body.username);

    if (!usernameResult.success){
        return res.status(404).json({
            success: false,
            message: usernameResult.reason}
        );
    }

    if (usernameResult.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "couldn't find username"}
        );
    }

    const passwordResult = await dbHandler.GetUserPasswordAndSaltWithUsername(req.body.username);

    if (!passwordResult.success){
        return res.status(404).json({
            success: false,
            message: usernameResult.reason}
        );
    }

    if (passwordResult.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "Couldn't find password"}
        );
    }

    if (passwordResult.value.rows[0].value == req.body.password){

        const token = await tokenSystem.CreateToken(req.body.username, 3600);

        res.cookie("bearer", token, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
        });

        res.setHeader("Access-Control-Allow-Origin",
             "http://ec2-54-204-100-237.compute-1.amazonaws.com");
        
        res.setHeader("Access-Control-Allow-Credentials", "true");

        return res.status(200).json({success: true,
            role: usernameResult.value.rows[0].role
        });
    }

    return res.status(404).json({
        success: false,
        message: "Incorrect password"});





}

export const GetSalt = async (res, username) => {
    const usernameResult = await dbHandler.GetUser(username);

    if (!usernameResult.success){
        return res.status(404).json({
            success: false,
            message: usernameResult.reason}
        );
    }

    if (usernameResult.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "couldn't find username"}
        );
    }

    const passwordResult = await dbHandler.GetUserPasswordAndSaltWithUsername(username);

    if (!passwordResult.success){
        return res.status(404).json({
            success: false,
            message: usernameResult.reason}
        );
    }

    if (passwordResult.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "Couldn't find password"}
        );
    }

    
    return res.status(200).json({success: true,
        salt: passwordResult.value.rows[0].salt
    });
}