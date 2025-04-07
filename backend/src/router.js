

export const RegisterRoutes = (server) => {
    server.get("/", (req, res) => {
        res.json({message: "Hello from backend"});
    });
}