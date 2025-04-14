import express from "express"
import cors from "cors"
let server = null
const PORT = 5000;





export const StartServer = () => {
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Backend running on port ${PORT}`);
    });

}
export const CreateServer = () => {
    server = express();
    server.use(express.urlencoded({ extended: true }));
    server.use(cors({
        origin: "http://ec2-54-204-100-237.compute-1.amazonaws.com:80",
        credentials: true,
    }));
    server.use(express.json());
    return server;
}

export const GetServerInstance = () => {
    return server;
}