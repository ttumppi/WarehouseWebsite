import * as dbHandler from "./db/dbHandler.js"
import * as loginHandler from "./pageHandlers/loginHandler.js"


export const RegisterRoutes = (server) => {
    server.post("/api/login", async (req, res) => {
       return await loginHandler.CorrectLogin(req, res);
    });


    server.get("/api/login/:username", async (req, res) => {
        return await loginHandler.GetSalt(res, req.params.username);
    })
}



await dbHandler.ConnectToDatabase();
await dbHandler.SetupDatabase();