import * as dbHandler from "./db/dbHandler.js"



export const RegisterRoutes = (server) => {
    server.get("/", (req, res) => {
        res.json({message: "Hello from backend"});
    });
}



await dbHandler.ConnectToDatabase();