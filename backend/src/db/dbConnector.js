import pkg from "pg"
import * as readFile from "../readFile.js"
import * as path from "path"

const { Pool } = pkg;

const dbFolderPath = path.dirname(new URL(import.meta.url).pathname);

const credentialsPath = path.join(dbFolderPath, "creds.spec")








const ReadDBCreds = async () => {

   return await readFile.ReadTextFile(credentialsPath);
    
}



const dbKeys = JSON.parse(await ReadDBCreds());

export const CreateDBConnection = async () => {
    return new Pool({
        user: dbKeys.prod.user,
        host: dbKeys.prod.host,
        database: dbKeys.prod.database,
        password: dbKeys.prod.password,
        port: 5432,
    });
}