import * as dbHandler from "../db/dbHandler.js"

export const CorrectLogin = async (req, res) => {

    const usernameResult = await dbHandler.GetUser(req.body.username);

    if (!usernameResult.success){
        return res.status(404).send(usernameResult.reason);
    }

    if (usernameResult.value.rows.length == 0){
        return res.status(404).send("Couldn't find username");
    }

    const passwordResult = await dbHandler.GetUserPasswordAndSaltWithUsername(req.body.username);

    if (!passwordResult.success){
        return res.status(404).send(passwordResult.reason);
    }

    if (passwordResult.value.rows.length == 0){
        return res.status(404).send("Couldn't find password");
    }

    if (passwordResult.value.rows[0].value == req.body.password){
        return res.status(200).json({success: true,
            role: `${usernameResult.value.rows[0].role}`
        });
    }



}

export const GetSalt = async (res, username) => {
    const usernameResult = await dbHandler.GetUser(username);

    if (!usernameResult.success){
        return res.status(404).send(usernameResult.reason);
    }

    if (usernameResult.value.rows.length == 0){
        return res.status(404).send("Couldn't find username");
    }

    const passwordResult = dbHandler.GetUserPasswordAndSaltWithUsername(username);

    if (!passwordResult.success){
        return res.status(404).send(passwordResult.reason);
    }

    if (passwordResult.value.rows.length == 0){
        return res.status(404).send("Couldn't find password");
    }

    return res.status(200).json({success: true,
        salt: (await passwordResult).value.rows[0].salt
    });
}