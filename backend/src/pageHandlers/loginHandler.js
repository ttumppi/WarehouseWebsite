import * as dbHandler from "../db/dbHandler.js"

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

    console.log("Done");
    if (passwordResult.value.rows[0].value == req.body.password){
        return res.status(200).json({success: true,
            role: usernameResult.value.rows[0].role
        });
    }



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