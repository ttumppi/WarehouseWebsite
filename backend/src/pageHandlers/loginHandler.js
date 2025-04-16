import * as dbHandler from "../db/dbHandler.js"
import * as tokenSystem from "../tokenHandling/tokenSystem.js"
import { User } from "../models/User.js"

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

    const role = usernameResult.value.rows[0].role;

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

        const token = await tokenSystem.CreateToken(req.body.username, role, 3600);

        res.cookie("bearer", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
        });


        return res.status(200).json({success: true,
            username: usernameResult.value.rows[0].username,
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

export const ChangePassword = async (req, res, username, password, salt) => {

    const userResult = await dbHandler.GetUser(username);

    if (!userResult.success){
        return res.status(404).json({
            success: false,
            message: userResult.reason
        });
    }

    if (userResult.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "Failed to get user"
        });
    }

    if (userResult.value.rows[0].role.includes("(F)")){
        const parsedRole = userResult.value.rows[0].role.replace("(F)", "");
        roleResult = await dbHandler.UpdateUserRole(new User(
            username, password, parsedRole));

        if (!roleResult.success){
            return res.status(404).json({
                success:false,
                message: roleResult.reason
            })
        }
    }
    
    const result = await dbHandler.UpdateUserPassword(new User
        (username, password, userResult.value.rows[0].role), salt);

    if (!result.success){
        return res.status(404).json({
            success:false,
            message: result.reason
        });
    }

    return res.status(200).json({
        success: true
    });
}