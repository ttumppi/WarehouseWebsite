import * as dbConnector from "./dbConnector.js"
import * as testDBConnector from "./testDBConnector.js"
import * as fs from "node:fs"
import * as path from "path"
import {Item} from "../models/Item.js"
import * as stringFunctions from "../stringFunctions.js"

let db = null;

const abc = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
    "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
]

let abcIndex = {};



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

const GetItemByIDQuery = `SELECT * FROM items WHERE id = $1`;

const GetItemsQuery = `SELECT * FROM items`; 

const ClearAllTablesQuery = `TRUNCATE TABLE shelfs, items, users, passwords
RESTART IDENTITY CASCADE`;

const AddShelfIntoShelfsTableQuery = `INSERT INTO shelfs (shelf_id, size)
 VALUES ($1, $2)`;

const GetLastShelfQuery = `SELECT shelf_id FROM shelfs ORDER BY id DESC LIMIT 1`;

const GetAllShelfsQuery = `SELECT * FROM shelfs`;
const GetShelfQuery = `SELECT * FROM shelfs WHERE shelf_id = $1`






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

const CharResets = async (char) => {

    return abcIndex[char] == abc.length -1; 
}

const LastCharReset = (index) => {
    return index == 0;
}

export const GenerateNewShelfID = async (lastID) => {

    
    let newID = lastID;

    if (newID == null){
        return abc[0];
    }

    for (let i = newID.length - 1; i > -1; i--){
        if (await (CharResets(newID[i]))){

            newID = stringFunctions.ReplaceChar(newID, i, abc[0]);

            if (LastCharReset(i)){
                newID += abc[0];
                break;
            }
            continue;
        }
        newID = stringFunctions.ReplaceChar(newID,
             i, abc[abcIndex[newID[i]] + 1]);
        break;
    }

    return newID;
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

export const GetItemBySerial = async (serial) => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetItemBySerialQuery, [serial]);
    }
    catch (error){
        console.log("Failed to get item by serial");
        return {}
    }
}

export const GetItemByManufacturer = async (manufacturer) => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetItemByManufacturerQuery, [manufacturer]);
    }
    catch (error){
        console.log("Failed to get item by manufacturer");
        return {}
    }
}

export const GetItemByModel = async (model) => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetItemByModelQuery, [model]);
    }
    catch (error){
        console.log("Failed to get item by model");
        return {}
    }
}

export const GetItem = async (item) => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetItemByManufacturerAndModelAndSerialQuery,
             [item.Manufacturer, item.Model, item.Serial]);
    }
    catch (error){
        console.log("Failed to get item by model");
        return {}
    }
}

export const GetAllShelfs = async () => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetAllShelfsQuery);
    }

    catch(error){
        console.log("Failed to get shelfs");
        return  {}
    }
}

const DeleteShelfTable = async (shelfName) => {
    await ThrowIfDBNotInit();

    const query = `DROP TABLE "${shelfName}"`

    try{
        await db.query(query);
    }
    catch(error){
        console.log("Failed to drop shelf table");
    }

}

export const ClearAllTables = async () => {
    await ThrowIfDBNotInit();

    const shelfs = await GetAllShelfs();

    for (let i = 0; i < shelfs.rows.length; i++){
        await DeleteShelfTable(shelfs.rows[i].shelf_id);
    }

    try{
        return await db.query(ClearAllTablesQuery);
    }
    catch(error){
        console.log("Failed to clear all tables");
    }
}



const GetLastShelfName = async () => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetLastShelfQuery);
    }
    catch(error){
        console.log("Failed to clear all tables");
    }
}

const AddShelf = async (shelfName, size) => {
    await ThrowIfDBNotInit();

    try{
        await db.query(AddShelfIntoShelfsTableQuery, [shelfName, size]);
    }
    catch(error){
        console.log("Failed to add shelf to shelfs table");
    }
}

export const CreateShelf = async (size) => {
    const row = await GetLastShelfName();

    const shelfName = await GenerateNewShelfID(row.rows[0]);

    await AddShelf(shelfName, size);

    const query = `CREATE TABLE "${shelfName}" 
    (
    id SERIAL PRIMARY KEY,
    item_id INT, 
    balance INT,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    )`;

    try{
        await db.query(query);
    }
    catch(error){
        console.log("Failed to create shelf");
        return "";
    }

    return shelfName;
}

const ShelfExists = async (shelfName) => {
    await ThrowIfDBNotInit();

    try{
        return (await db.query(GetShelfQuery, [shelfName])).rows.length != 0;
    }
    catch(error){
        console.log("Failed to query shelf");
        return false;
    }

}

export const GetShelfItems = async (shelfName) => {
    
    if (!(await ShelfExists(shelfName))){
        console.log("Shelf does not exist");
        return;
    }

    const query = `SELECT * FROM "${shelfName}"`

    try{
        return await db.query(query);
    }
    catch (error){
        console.log("Couldn't get shelf items");
        return {}
    }
}

export const GetShelf = async (shelfName) => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetShelfQuery, [shelfName]);
    }
    catch(error){
        console.log("Failed to query shelf");
        return {}
    }
}

export const AddItemToShelf = async (shelfName, itemID, balance) => {
    await ThrowIfDBNotInit();

    if (/^[a-z]/.test(shelfName)){
        console.log("Unsafe table name");
        return;
    }

    const query = `INSERT INTO "${shelfName}" (item_id, balance) 
    VALUES ($1, $2)` 

    try{
        await db.query(query, [itemID, balance])
    }
    catch(error){
        console.log("Couldn't add item to shelf");
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

const GenerateABCIndexDictionary = () => {
    for (let i = 0; i < abc.length; i++){
        abcIndex[abc[i]] = i;
    }
}


GenerateABCIndexDictionary();


