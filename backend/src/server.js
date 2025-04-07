import express from "express"
let server = null
const PORT = 5000;





export const StartServer = () => {
    server.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });

}
export const CreateServer = () => {
    server = express();
    return server;
}

export const GetServerInstance = () => {
    return server;
}