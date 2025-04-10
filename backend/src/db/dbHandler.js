import * as dbConnector from "./dbConnector.js"
import * as testDBConnector from "./testDBConnector.js"
import * as fs from "node:fs"
import * as path from "path"


let db = null;

const dbFolderPath = path.dirname(new URL(import.meta.url).pathname);

const sqlFilePath = path.join(dbFolderPath, "init.sql")

export const CreateItem = async () => {

}

export const ConnectToDatabase = async () => {

    if (db != null){
        throw new Error("DB handler is already connected to a db connector");
    }

    db = await dbConnector.CreateDBConnection();
}

export const ConnectToTestDatabase = async () => {
    
    if (db != null){
        throw new Error("DB handler is already connected to a db connector");
    }
    
    db = await testDBConnector.CreateDBConnection();
}

export const GetSplitDBSetupQueries = async () => {
    const query = fs.readFileSync(sqlFilePath, "utf8");

    let queries = query.split(";");

    const regex = /[^\s]/;
    for (let i = queries.length -1 ; i > -1; i--){
        if (!queries[i].match(regex)){
            queries.splice(i, 1);
        }
    }

    return queries;
}

export const SetupDatabase = async () => {

    try{
        const queries = await GetSplitDBSetupQueries();

        for (const query of queries){
            await db.query(query);
        }
        
    }

    catch(error){
        console.log(`Couldn't initialize database: ${error}`);
    }
   
}





