import * as dbHandler from "./db/dbHandler.js"
import * as loginHandler from "./pageHandlers/loginHandler.js"
import * as tokenSystem from "./tokenHandling/tokenSystem.js"
import * as mainHandler from "./pageHandlers/mainHandler.js"

const CheckAuth = async (req, res, next) => {
    const result = await tokenSystem.VerifyAndGetTokenFromHeaders(req.headers);

    if (!result.success){
        return res.status(401).json({success: false,
            message: "unauthorized"
        });
    }

    req.user = result.token;
    next();
}

export const RegisterRoutes = (server) => {

    server.post("/api/login", async (req, res) => {

        console.log("/login POST");
        return await loginHandler.CorrectLogin(req, res);
    });


    server.get("/api/login/:username", async (req, res) => {
        console.log("/login/:username GET");
        return await loginHandler.GetSalt(res, req.params.username);
    })

    server.get("/api/shelfs", CheckAuth, async (req, res) => {
        console.log("/api/shelfs GET");
        return await mainHandler.GetShelfs(req, res);
    })

    server.post("/api/shelf", CheckAuth, async (req, res) => {
        console.log("/api/shelf POST");
        return await mainHandler.CreateShelf(req, res);
    })
}



await dbHandler.ConnectToDatabase();
await dbHandler.SetupDatabase();