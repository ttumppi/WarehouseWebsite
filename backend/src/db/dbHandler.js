import * as dbConnector from "./dbConnector.js"
import * as testDBConnector from "./testDBConnector.js"
import * as fs from "node:fs"
import * as path from "path"
import {Item} from "../models/Item.js"
import * as stringFunctions from "../stringFunctions.js"
import {User} from "../models/User.js"

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

const DeleteItemQuery = `DELETE FROM items WHERE id = $1`

const ClearAllTablesQuery = `TRUNCATE TABLE shelfs, items, users, passwords
RESTART IDENTITY CASCADE`;

const AddShelfIntoShelfsTableQuery = `INSERT INTO shelfs (shelf_id, size)
 VALUES ($1, $2)`;

const GetLastShelfQuery = `SELECT shelf_id FROM shelfs ORDER BY id DESC LIMIT 1`;
const DeleteShelfQuery = `DELETE FROM shelfs WHERE shelf_id = $1`;

const GetAllShelfsQuery = `SELECT * FROM shelfs`;
const GetShelfQuery = `SELECT * FROM shelfs WHERE shelf_id = $1`
const GetShelfSizeByNameQuery = `SELECT size FROM shelfs WHERE shelf_id = $1`;
const ChangeSelfSizeQuery = `UPDATE shelfs SET size = $1 WHERE shelf_id = $2`;

const SaveUsernameAndLevelQuery = `INSERT INTO users (username, role)
VALUES ($1, $2)`;

const SavePasswordQuery = `INSERT INTO passwords (id, value, salt)
VALUES ($1, $2, $3)`;

const UpdateUserRoleQuery = `UPDATE users SET role = $1 WHERE id = $2`;

const UpdatePasswordQuery = `UPDATE passwords SET value = $1 AND 
salt = $2 WHERE id = $3`

const DeleteUserQuery = `DELETE FROM users WHERE id = $1`

const FindUserByUsernameQuery = `SELECT * FROM users WHERE username = $1`;

const FindUserByIDQuery = `SELECT * FROM users WHERE id = $1`;

const FindUserPasswordAndSaltQuery = `SELECT * FROM passwords WHERE id = $1`;



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

const ShelfNameValid = async (shelfName) => {
    if (/[^a-z]/.test(shelfName)){
        console.log(`Unsafe table name ${shelfName}`);
        return false;
    }
    return true;
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

export const CreateItem = async (item) => {

    await ThrowIfDBNotInit();

    if ((await GetItem(item)).rows.length != 0){
        console.log("Item already exists");
        return;
    }

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



export const DeleteItem = async (item) => {
    await ThrowIfDBInit();

    const itemRow = await GetItem(item);
    try{
        await db.query(DeleteItemQuery, [itemRow.rows[0].id]);
    }
    catch(error){
        console.log("Failed to delete item");
    }
}

export const DeleteItemFromShelf = async (shelfName, location) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return;
    }

    if (!(await ShelfLocationInBounds(shelfName, location))){
        return;
    }

    const query = `DELETE FROM "${shelfName}" WHERE location = $1`;

    try{
        await db.query(query, [location]);
    }
    catch (error){
        console.log("Failed to delete item from shelf");
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

    if (!(await ShelfNameValid(shelfName))){
        return;
    }

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

export const DeleteShelf = async (shelfName) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return;
    }

    await DeleteShelfTable(shelfName);

    try{
        db.query(DeleteShelfQuery, [shelfName]);
    }
    catch(error){
        console.log("Failed to delete shelf");
    }
    
}

export const TransferItem = async (currentShelfName, currentLocation,
    targetShelfName, targetLocation) => {
    
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(currentShelfName))){
        return;
    }

    if (!(await ShelfNameValid(targetShelfName))){
        return;
    }

    if (!(await ShelfLocationInBounds(targetShelfName, targetLocation))){
        console.log("Transfer target does not have enough space")
        return;
    }

    const currentShelfRow = await GetShelfItemByLocation(currentShelfName,
        currentLocation);
    
    if (currentShelfRow.rows.length == 0){
        console.log("origin shelf location empty");
        return;
    }

    const targetShelfLocation = await GetShelfItemByLocation(targetShelfName,
        targetLocation);
    
    if (targetShelfLocation.rows.length != 0){
        console.log("target shelf location not empty");
        return;
    }

    const item = await GetItemByID(currentShelfRow.rows[0].item_id);

    await AddItemToShelf(targetShelfName, item.rows[0].id,
         currentShelfRow.rows[0].balance, targetLocation);

    await DeleteItemFromShelf(currentShelfName, currentLocation);


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

const GetShelfSize = async (shelfName) => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(GetShelfSizeByNameQuery, [shelfName]);
    }
    catch(error){
        console.log("Failed to get shelf size");
        return {};
    }

}

export const GetAvailableShelfLocations = async (shelfName) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {};
    }

    const shelfSize = await GetShelfSize(shelfName);

    const queryFreeSpaces = `SELECT num FROM GENERATE_SERIES(1, $1, 1) As num WHERE 
    num NOT IN (SELECT location FROM "${shelfName}")`;

    try{
        return await db.query(queryFreeSpaces, [shelfSize.rows[0].size]);
    }
    catch(error){
        console.log("Failed to get free spaces in a shelf");
        return {};
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

    let shelfName = null;
    if (row.rows[0] == null){
        shelfName = await GenerateNewShelfID(null);
    }
    else{
        shelfName = await GenerateNewShelfID(row.rows[0].shelf_id);
    }

    await AddShelf(shelfName, size);

    const query = `CREATE TABLE "${shelfName}" 
    (
    id SERIAL PRIMARY KEY,
    item_id INT, 
    balance INT,
    location INT UNIQUE,
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



const ShelfLocationInBounds = async (shelfName, location) => {

    const shelfSize = (await GetShelfSize(shelfName)).rows[0].size;

    return location >= 1 && location <= shelfSize;
}

export const AddItemToShelf = async (shelfName, itemID, balance, location) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return;
    }

    if (!(await ShelfLocationInBounds(shelfName, location))){
        console.log("item location out of bounds");
        return;
    }

    if ((await GetShelfItemByLocation(shelfName, location)).rows.length != 0){
        console.log("Shelf location is reserved");
        return;
    }

    const query = `INSERT INTO "${shelfName}" (item_id, balance, location) 
    VALUES ($1, $2, $3)` 

    try{
        await db.query(query, [itemID, balance, location])
    }
    catch(error){
        console.log("Couldn't add item to shelf");
    }

}

export const GetLargestLocationInShelf = async (shelfName) => {
    ThrowIfDBNotInit();

    if (!(await ShelfNameValid())){
        return;
    }

    const query = `SELECT MAX(location) AS max_location
    FROM "${shelfName}"`

    try{
        return await db.query(query);
    }
    catch (error){
        console.log("Couldn't find largest location in shelf");
        return {};
    }
}

export const ChangeShelfSize = async (shelfName, newSize) => {

    ThrowIfDBNotInit();

    if (!(await ShelfNameValid())){
        return;
    }

    const largestLocation = await GetLargestLocationInShelf(shelfName);

    if (newSize <= largestLocation.rows[0].max_location){
        console.log("Size is too small for existing items");
        return;
    }
    
    try{
        await db.query(ChangeSelfSizeQuery, [newSize, shelfName]);
    }
    catch(error){
        console.log("Couldn't change shelf size");
        
    }


}

export const GetShelfItem = async (shelfName, item) => {

    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return;
    }

    const itemRow = await GetItem(item);

    

    const query = `SELECT * FROM "${shelfName}" WHERE item_id = $1`;

    try{
        const shelfItemRow = await db.query(query, [itemRow.rows[0].id]);
        return shelfItemRow;
    }
    catch(error){
        console.log("Failed to query shelf item");
        return {}
    }

    
}

export const GetShelfItemByLocation = async (shelfName, location) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {};
    }

    if (!(await ShelfLocationInBounds(shelfName, location))){
        console.log("Shelf location out of bounds");
        return {};
    }

    const query = `SELECT * FROM "${shelfName}" WHERE location = $1`;

    try{
        return await db.query(query, [location]);
    }

    catch(error){
        console.log("Failed to get shelf item");
        return {}
    }
}
export const ChangeItemBalance = async (shelfName, amount, item) => {

    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return;
    }

    const itemData = await GetShelfItem(shelfName, item);


    const newBalance = itemData.rows[0].balance + amount;

    const query = `UPDATE "${shelfName}" SET balance = $1 WHERE id = $2`;

    try{
        await db.query(query, [newBalance, itemData.rows[0].id]);
    }
    catch(error){
        console.log("Failed to change item balance");
    }



}

export const UserExists = async (username) => {
    await ThrowIfDBNotInit();

    try{
        return (await db.query(FindUserByUsernameQuery, [username]))
        .rows.length != 0; 
    }
    catch (error){
        console.log("Failed to query user existence");
        console.log(error);
        return false;
    }

}

export const GetUser = async (username) => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(FindUserByUsernameQuery, [username]);
    }
    catch(error){
        console.log("Failed to query username");
        console.log(error);
        return {};
    }
}

export const GetUserPasswordAndSaltWithID = async (userID) => {
    await ThrowIfDBNotInit();

    try{
        return await db.query(FindUserPasswordAndSaltQuery, [userID]);
    }
    catch (error){
        console.log("Failed to retrieve user password and salt");
        console.log(error);
    }
}

export const GetUserPasswordAndSaltWithUsername = async (username) => {
    await ThrowIfDBNotInit();

    const userRow = await GetUser(username);

    try{
        return await db.query(FindUserPasswordAndSaltQuery, [userRow.rows[0].id]);
    }
    catch (error){
        console.log("Failed to retrieve user password and salt");
        
    }
}

export const SaveUser = async (user, salt) => {
    await ThrowIfDBNotInit();

    if ((await UserExists(user.Username))){
        return;
    }

    try{
        await db.query(SaveUsernameAndLevelQuery, [user.Username, user.Role]);
        const userRow = await GetUser(user.Username);
        await db.query(SavePasswordQuery, [user.Password, salt, 
            userRow.rows[0].id]);
    }
    catch (error){
        console.log("Failed to save user");
        console.log(error);
    }
}

export const UpdateUserPassword = async (user, salt) => {
    await ThrowIfDBNotInit();

    if (!(await UserExists(user.Username))){
        return;
    }

    const userRow = await GetUser(user.Username);
    try{
        await db.query(UpdatePasswordQuery, [user.Password, salt, 
            userRow.rows[0].id
        ]);
    }
    catch(error){
        console.log("Failed to update password");
        console.log(error);
    }
}

export const UpdateUserRole = async (user) => {
    await ThrowIfDBNotInit();

    if (!(await UserExists(user.Username))){
        return;
    }

    const userRow = await GetUser(user.Username);
    try{
        await db.query(UpdateUserRoleQuery, [user.Role, userRow.rows[0].id]);
    }
    catch (error){
        console.log("Failed to update user role");
    }
}

export const DeleteUser = async (user) => {
    await ThrowIfDBNotInit();

    if (!(await UserExists(user.Username))){
        console.log("User does not exist");
        return;
    }

    const userID = (await GetUser(user.Username)).rows[0].id;
    try{
        await db.Query(DeleteUserQuery, [userID]);
    }
    catch (error){
        console.log("Couldn't delete user");
        console.log(error);
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


