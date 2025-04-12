import * as dbConnector from "./dbConnector.js"
import * as testDBConnector from "./testDBConnector.js"
import * as fs from "node:fs"
import * as path from "path"
import {Item} from "../models/Item.js"

let db = null;

const dbFolderPath = path.dirname(new URL(import.meta.url).pathname);

const sqlFilePath = path.join(dbFolderPath, "init.sql")

const createItemQuery = `INSERT INTO items
    (manufacturer, model, serial)
    VALUES ($1, $2, $3)`

const GetItemBySerialQuery = `SELECT * FROM items WHERE serial = $1`;
const GetItemByManufacturerQuery = `SELECT * FROM items WHERE manufacturer = $1`;
const GetItemByModelQuery = `SELECT * FROM items WHERE model = $1`;
const GetItemBySerialAndManufacturerQuery = `SELECT * FROM items
 WHERE serial = $1 AND manufacturer = $2`;
const GetItemBySerialAndModelQuery = `SELECT * FROM items
 WHERE serial = $1 AND model = $2`;
const GetItemByManufacturerAndModelQuery = `SELECT * FROM items
 WHERE manufacturer = $1 AND model = $2`;
const GetItemByManufacturerAndModelAndSerialQuery = `SELECT * FROM items
 WHERE manufacturer = $1 AND model = $2 AND serial = $3`;

const GetItemByIDQuery = `SELECT * FROM items WHERE id = $1`

const GetItemsQuery = `SELECT * FROM items`

const ClearAllTablesQuery = `TRUNCATE TABLE shelfs, items, users, passwords
RESTART IDENTITY CASCADE`;


const ThrowIfDBNotInit= async () => {
    if (db == null){
        throw new Error("DB handler is not connected to a db connector");
    }
}

const ThrowIfDBInit = async () => {
    if (db != null){
        throw new Error("DB handler is already connected to a db connector");
    }
}

export const CreateItem = async (item) => {

    await ThrowIfDBNotInit();

    try{
        await db.query(createItemQuery, 
            [item.Manufacturer, item.Model, item.Serial]);
    }
    catch(error){
        console.log("Failed to create item");
        
    }
}

export const GetItems = async () => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetItemsQuery);
    }
    catch (error){
        console.log("Failed to get items from db");
        return {}
    }
}

export const GetItemByID = async (id) => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetItemByIDQuery, [id]);
    }
    catch (error){
        console.log("Failed to get item by id");
        return {}
    }
}

export const ClearAllTables = async () => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(ClearAllTablesQuery);
    }
    catch(error){
        console.log("Failed to clear all tables");
    }
}

export const ConnectToDatabase = async () => {

    await ThrowIfDBInit();

    db = await dbConnector.CreateDBConnection();
}

export const ConnectToTestDatabase = async () => {
    
   await ThrowIfDBInit();
    
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

    ThrowIfDBNotInit();

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





