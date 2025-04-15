import * as dbHandler from "./db/dbHandler.js"
import * as loginHandler from "./pageHandlers/loginHandler.js"
import * as tokenSystem from "./tokenHandling/tokenSystem.js"
import * as mainHandler from "./pageHandlers/mainHandler.js"
import * as itemHandler from "./pageHandlers/itemHandler.js"

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

    server.delete("/api/shelf", CheckAuth, async (req, res) => {
        console.log("/api/shelf DELETE");
        return await mainHandler.DeleteShelf(req, res);
    })

    server.get("/api/shelf/:shelf", CheckAuth, async (req, res) => {
        console.log("/api/shelf/:shelf GET");
        return await mainHandler.GetShelfItems(req, res, req.params.shelf);
    })

    server.delete("/api/shelf/:shelf", CheckAuth, async (req, res) => {
        console.log("/api/shelf/:shelf DELETE");
        return await mainHandler.DeleteItemFromShelf(req, res, req.params.shelf);
    })

    server.get("/api/shelf/:shelf/locations", CheckAuth, async (req, res) => {
        console.log("/api/shelf/:shelf/locations GET");
        return await mainHandler.GetShelfAvailableLocations
        (req, res, req.params.shelf);
    })

    server.post("/api/shelf/:shelf/item", CheckAuth, async (req, res) => {
        console.log("/api/shelf/:shelf/item POST");
        return await mainHandler.AddItemToShelf(req, res, req.params.shelf);
    })

    server.post("/api/item", CheckAuth, async (req, res) => {
        console.log("/api/item POST");
        return await itemHandler.CreateItem(req, res);
    })

    server.get("/api/item", CheckAuth, async (req, res) => {
        console.log("/api/item GET");
        return await itemHandler.GetItems(req, res);
    })

    server.delete("/api/item/:id", CheckAuth, async (req, res) => {
        console.log("/api/item/:id DELETE");
        return await itemHandler.DeleteItem(req, res, req.params.id);
    })
}



await dbHandler.ConnectToDatabase();
await dbHandler.SetupDatabase();