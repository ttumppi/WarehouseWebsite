import * as dbConnector from "./dbConnector.js"
import * as fs from "node:fs"
import * as path from "path"


const db = await dbConnector.CreateDBConnection();

const dbFolderPath = path.dirname(new URL(import.meta.url).pathname);

const sqlFilePath = path.join(dbFolderPath, "init.sql")

export const CreateItem = async () => {

}

const SetupDatabase = async () => {

    try{
        const query = fs.readFileSync(sqlFilePath, "utf8");

        console.log(query);
        await db.query(query);
    }

    catch(error){
        console.log("Couldn't initialize database");
    }
   
}





await SetupDatabase();