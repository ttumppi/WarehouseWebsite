import express from "express"
import cors from "cors"
let server = null
const PORT = 5000;





export const StartServer = () => {
    server.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });

}
export const CreateServer = () => {
    server = express();
    server.use(express.urlencoded({ extended: true }));
    server.use(cors({
        origin: "http://ec2-54-204-100-237.compute-1.amazonaws.com",
        credentials: false,
    }));
    server.use(express.json());
    return server;
}

export const GetServerInstance = () => {
    return server;
}