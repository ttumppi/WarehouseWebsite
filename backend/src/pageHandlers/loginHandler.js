import * as dbHandler from "../db/dbHandler.js"

export const CorrectLogin = async (req, res) => {

    const usernameResult = await dbHandler.GetUser(req.body.username);

    if (!usernameResult.success){
        return res.json({
            success: false,
            message: usernameResult.reason,
            status: 404}
        );
    }

    if (usernameResult.value.rows.length == 0){
        return res.json({
            success: false,
            message: "couldn't find username",
            status: 404}
        );
    }

    const passwordResult = await dbHandler.GetUserPasswordAndSaltWithUsername(req.body.username);

    if (!passwordResult.success){
        return res.json({
            success: false,
            message: usernameResult.reason,
            status: 404}
        );
    }

    if (passwordResult.value.rows.length == 0){
        return res.json({
            success: false,
            message: "Couldn't find password",
            status: 404}
        );
    }

    if (passwordResult.value.rows[0].value == req.body.password){
        return res.json({success: true,
            role: usernameResult.value.rows[0].role,
            status:200
        });
    }



}

export const GetSalt = async (res, username) => {
    const usernameResult = await dbHandler.GetUser(username);

    if (!usernameResult.success){
        return res.json({
            success: false,
            message: usernameResult.reason,
            status: 404}
        );
    }

    if (usernameResult.value.rows.length == 0){
        return res.json({
            success: false,
            message: "couldn't find username",
            status: 404}
        );
    }

    const passwordResult = dbHandler.GetUserPasswordAndSaltWithUsername(username);

    if (!passwordResult.success){
        return res.json({
            success: false,
            message: usernameResult.reason,
            status: 404}
        );
    }

    if (passwordResult.value.rows.length == 0){
        return res.json({
            success: false,
            message: "Couldn't find password",
            status: 404}
        );
    }

    return res.json({success: true,
        salt: passwordResult.value.rows[0].salt,
        status: 200
    });
}