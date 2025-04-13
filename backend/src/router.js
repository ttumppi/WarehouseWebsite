import * as dbHandler from "./db/dbHandler.js"
import * as loginHandler from "./pageHandlers/loginHandler.js"


export const RegisterRoutes = (server) => {
    server.post("/login", async (req, res) => {
       return await loginHandler.CorrectLogin(req, res);
    });


    server.get("/login/:username", async (req, res) => {
        return await loginHandler.GetSalt(res, req.params.username);
    })
}



await dbHandler.ConnectToDatabase();
await dbHandler.SetupDatabase();