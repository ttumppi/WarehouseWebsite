import Pool from "pg"
import * as fs from "node:fs"












const ReadDBCreds = async () => {

    return new Promise( (resolve, reject) => {
        fs.readFile("creds.spec", "utf8", (error, data) => {
            if (error){
                console.log(`Failed to read credentials ${error}`);
                reject( new Error("No db credentials file"));
            }
            else{
                resolve(data);
            }
        })
        
    })
    
}

export const CreateDBConnection = async () => {
    return new Pool({
        user: dbKeys.user,
        host: crdbKeyseds.host,
        database: dbKeys.database,
        password: dbKeys.password,
        port: 5432,
    });
}

const dbKeys = await ReadDBCreds();