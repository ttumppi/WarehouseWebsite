import pkg from "pg"
import * as fs from "node:fs"
import * as path from "path"

const { Pool } = pkg;

const dbFolderPath = path.dirname(new URL(import.meta.url).pathname);

const credentialsPath = path.join(dbFolderPath, "creds.spec")








const ReadDBCreds = async () => {

    return new Promise( (resolve, reject) => {
        fs.readFile(credentialsPath, "utf8", (error, data) => {
            if (error){
                reject( new Error("Failed to read db credentials"));
            }
            else{
                resolve(data);
            }
        })
        
    })
    
}



const dbKeys = await ReadDBCreds();

export const CreateDBConnection = async () => {
    return new Pool({
        user: dbKeys.user,
        host: dbKeys.host,
        database: dbKeys.database,
        password: dbKeys.password,
        port: 5432,
    });
}