import * as serverFunctions from "./server.js"
import * as router from "./router.js"

const server = serverFunctions.CreateServer();

router.RegisterRoutes(server);

serverFunctions.StartServer();