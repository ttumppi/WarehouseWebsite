import pkg from "pg"
import * as readFile from "../readFile.js"

const { Pool } = pkg;

const dbFolderPath = path.dirname(new URL(import.meta.url).pathname);

const credentialsPath = path.join(dbFolderPath, "creds.spec")








const ReadDBCreds = async () => {

    return await readFile.ReadTextFile(credentialsPath);
    
}



const dbKeys = JSON.parse(await ReadDBCreds());

export const CreateDBConnection = async () => {
    return new Pool({
        user: dbKeys.test.user,
        host: dbKeys.test.host,
        database: dbKeys.test.database,
        password: dbKeys.test.password,
        port: 5432,
    });
}