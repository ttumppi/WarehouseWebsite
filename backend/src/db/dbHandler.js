import * as dbConnector from "./dbConnector.js"
import * as fs from "node:fs"
import * as path from "path"


let db = null;

const dbFolderPath = path.dirname(new URL(import.meta.url).pathname);

const sqlFilePath = path.join(dbFolderPath, "init.sql")

export const CreateItem = async () => {

}

const ConnectToDatabase = async () => {
    db = await dbConnector.CreateDBConnection();
}

const GetSplitDBSetupQueries = async () => {
    const query = fs.readFileSync(sqlFilePath, "utf8");

    return query.split(";");
}

const SetupDatabase = async () => {

    try{
        const queries = await GetSplitDBSetupQueries();

        for (const query of queries){
            await db.query(query);
        }
        
    }

    catch(error){
        console.log("Couldn't initialize database");
    }
   
}





