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

const UpdatePasswordQuery = `UPDATE passwords SET value = $1, 
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
        const result = await db.query(GetItemByManufacturerAndModelAndSerialQuery,
            [item.Manufacturer, item.Model, item.Serial]);
        return {success: true,
            value: result}
    }
    catch (error){
        console.log("Failed to get item by model");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const CreateItem = async (item) => {

    await ThrowIfDBNotInit();

    if ((await GetItem(item)).value.rows.length != 0){
        console.log("Item already exists");
        return {success: false,
            reason : "Item already exists"
        }
    }

    try{
        const result = await db.query(createItemQuery, 
            [item.Manufacturer, item.Model, item.Serial]);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to create item");
        return {success: false,
            reason : "db fail"
        }
        
    }
}

export const GetItems = async () => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(GetItemsQuery);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to get items from db");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const GetItemByID = async (id) => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(GetItemByIDQuery, [id]);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to get item by id");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const GetItemBySerial = async (serial) => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(GetItemBySerialQuery, [serial]);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to get item by serial");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const GetItemByManufacturer = async (manufacturer) => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(GetItemByManufacturerQuery, [manufacturer]);

        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to get item by manufacturer");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const GetItemByModel = async (model) => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(GetItemByModelQuery, [model]);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to get item by model");
        return {success: false,
            reason : "db fail"
        }
    }
}



export const DeleteItem = async (item) => {
    await ThrowIfDBNotInit();

    const itemRow = await GetItem(item);
    try{
        const result = await db.query(DeleteItemQuery, [itemRow.value.rows[0].id]);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to delete item");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const DeleteItemViaID = async (id) => {

    await ThrowIfDBNotInit();

    try{
        const result = await db.query(DeleteItemQuery, [id]);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to delete item");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const DeleteItemFromShelf = async (shelfName, location) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    if (!(await ShelfLocationInBounds(shelfName, location))){
        return {success: false,
            reason : "Shelf location outside shelf size"
        }
    }

    const query = `DELETE FROM "${shelfName}" WHERE location = $1`;

    try{
        const result = await db.query(query, [location]);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to delete item from shelf");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const GetAllShelfs = async () => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(GetAllShelfsQuery);
        return {success: true,
            value: result
        };
    }

    catch(error){
        console.log("Failed to get shelfs");
        return {success: false,
            reason : "db fail"
        }
    }
}

const DeleteShelfTable = async (shelfName) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    const query = `DROP TABLE "${shelfName}"`

    try{
        const result = await db.query(query);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to drop shelf table");
        return {success: false,
            reason : "db fail"
        }
    }

}

export const ClearAllTables = async () => {
    await ThrowIfDBNotInit();

    const shelfs = await GetAllShelfs();

    for (let i = 0; i < shelfs.value.rows.length; i++){
        await DeleteShelfTable(shelfs.value.rows[i].shelf_id);
    }

    try{
        const result = await db.query(ClearAllTablesQuery);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to clear all tables");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const DeleteShelf = async (shelfName) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    await DeleteShelfTable(shelfName);

    try{
        const result = await db.query(DeleteShelfQuery, [shelfName]);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to delete shelf");
        return {success: false,
            reason : "db fail"
        }
    }
    
}

export const TransferItem = async (currentShelfName, currentLocation,
    targetShelfName, targetLocation) => {
    
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(currentShelfName))){
        return {success: false,
            reason : "current shelf name not valid"
        }
    }

    if (!(await ShelfNameValid(targetShelfName))){
        return {success: false,
            reason : "target shelf name not valid"
        }
    }

    if (!(await ShelfLocationInBounds(targetShelfName, targetLocation))){
        console.log("Transfer target does not have enough space")
        return {success: false,
            reason : "target shelf location outside shelf size"
        }
    }

    const currentShelfRow = await GetShelfItemByLocation(currentShelfName,
        currentLocation);
    
    if (currentShelfRow.value.rows.length == 0){
        console.log("origin shelf location empty");
        return {success: false,
            reason : "item not found in current shelf location"
        }
    }

    const targetShelfLocation = await GetShelfItemByLocation(targetShelfName,
        targetLocation);
    
    if (targetShelfLocation.value.rows.length != 0){
        console.log("target shelf location not empty");
        return {success: false,
            reason : "target shelf location not empty"
        }
    }

    const item = await GetItemByID(currentShelfRow.value.rows[0].item_id);

    await AddItemToShelf(targetShelfName, item.value.rows[0].id,
         currentShelfRow.value.rows[0].balance, targetLocation);

    await DeleteItemFromShelf(currentShelfName, currentLocation);

    return {success: true};


}


const GetLastShelfName = async () => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(GetLastShelfQuery);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to clear all tables");
        return {success: false,
            reason : "db fail"
        }
    }
}

const GetShelfSize = async (shelfName) => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(GetShelfSizeByNameQuery, [shelfName]);
        return {success:true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to get shelf size");
        console.log(error);
        return {success: false,
            reason : "db fail"
        }
    }

}

export const GetAvailableShelfLocations = async (shelfName) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    const shelfSize = await GetShelfSize(shelfName);

    const queryFreeSpaces = `SELECT num FROM GENERATE_SERIES(1, $1, 1) As num WHERE 
    num NOT IN (SELECT location FROM "${shelfName}")`;

    try{
        const result = await db.query(queryFreeSpaces, [shelfSize.value.rows[0].size]);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to get free spaces in a shelf");
        console.log(error);
        return {success: false,
            reason : "db fail"
        }
    }
}

const AddShelf = async (shelfName, size) => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(AddShelfIntoShelfsTableQuery, [shelfName, size]);
        return {success:true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to add shelf to shelfs table");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const CreateShelf = async (size) => {
    const row = await GetLastShelfName();

    let shelfName = null;
    if (row.value.rows[0] == null){
        shelfName = await GenerateNewShelfID(null);
    }
    else{
        shelfName = await GenerateNewShelfID(row.value.rows[0].shelf_id);
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
        const result = await db.query(query);
        return {success: true,
            value: shelfName,
        };
    }
    catch(error){
        console.log("Failed to create shelf");
        return {success: false,
            reason : "db fail",
            value: shelfName
        }
    }

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


    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    if (!(await ShelfExists(shelfName))){
        console.log("Shelf does not exist");
        return {success: false,
            reason : "shelf does not exist"
        }
    }

    const query = `SELECT * FROM "${shelfName}"`

    try{
        const result = await db.query(query);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Couldn't get shelf items");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const  GetItemInfoForShelfItems = async (shelfName) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    const query = `SELECT * FROM items WHERE id IN
    (SELECT item_id FROM "${shelfName}")`


    try{
        const result = await db.query(query);
        return {
            success:true,
            value: result
        }
    }
    catch(error){
        console.log("Failed to get items info for shelf items");
        return {success: false,
            reason: "db fail"
        }
    }

}

export const GetShelf = async (shelfName) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    try{
        const result = await db.query(GetShelfQuery, [shelfName]);
        return {success:true,
            value: result
        }
    }
    catch(error){
        console.log("Failed to query shelf");
        return {success: false,
            reason : "db fail"
        }
    }
}



const ShelfLocationInBounds = async (shelfName, location) => {

    const shelfSize = (await GetShelfSize(shelfName)).value.rows[0].size;

    return location >= 1 && location <= shelfSize;
}

export const AddItemToShelf = async (shelfName, itemID, balance, location) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    if (!(await ShelfLocationInBounds(shelfName, location))){
        console.log("item location out of bounds");
        return {success: false,
            reason : "item location out of bounds"
        }
    }

    if ((await GetShelfItemByLocation(shelfName, location)).value.rows.length != 0){
        console.log("Shelf location is reserved");
        return {success: false,
            reason : "shelf location is reserved"
        }
    }

    const query = `INSERT INTO "${shelfName}" (item_id, balance, location) 
    VALUES ($1, $2, $3)` 

    try{
        const result = await db.query(query, [itemID, balance, location]);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Couldn't add item to shelf");
        return {success: false,
            reason : "db fail"
        }
    }

}

export const GetLargestLocationInShelf = async (shelfName) => {
    ThrowIfDBNotInit();

    if (!(await ShelfNameValid())){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    const query = `SELECT MAX(location) AS max_location
    FROM "${shelfName}"`

    try{
        const result = await db.query(query);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Couldn't find largest location in shelf");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const ChangeShelfSize = async (shelfName, newSize) => {

    ThrowIfDBNotInit();

    if (!(await ShelfNameValid())){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    const largestLocation = await GetLargestLocationInShelf(shelfName);

    if (newSize <= largestLocation.value.rows[0].max_location){
        console.log("Size is too small for existing items");
        return {success: false,
            reason : "new size is too small for existing items"
        }
    }
    
    try{
        const result = await db.query(ChangeSelfSizeQuery, [newSize, shelfName]);
        return {success: true,
            value: result
        }
    }
    catch(error){
        console.log("Couldn't change shelf size");
        return {success: false,
            reason : "db fail"
        }
    }


}

export const GetShelfItem = async (shelfName, item) => {

    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    const itemRow = await GetItem(item);

    

    const query = `SELECT * FROM "${shelfName}" WHERE item_id = $1`;

    try{
        const result = await db.query(query, [itemRow.value.rows[0].id]);
        return {success: true,
            value: result
        }
    }
    catch(error){
        console.log("Failed to query shelf item");
        return {success: false,
            reason : "db fail"
        }
    }

    
}

export const GetShelfItemViaID = async (shelfName, id) => {

    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }


    

    const query = `SELECT * FROM "${shelfName}" WHERE id = $1`;

    try{
        const result = await db.query(query, [id]);
        return {success: true,
            value: result
        }
    }
    catch(error){
        console.log("Failed to query shelf item");
        return {success: false,
            reason : "db fail"
        }
    }

    
}

export const GetShelfItemByLocation = async (shelfName, location) => {
    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name not valid"
        }
    }

    if (!(await ShelfLocationInBounds(shelfName, location))){
        console.log("Shelf location out of bounds");
        return {success: false,
            reason : "shelf location out of bounds"
        }
    }

    const query = `SELECT * FROM "${shelfName}" WHERE location = $1`;

    try{
        const result = await db.query(query, [location]);
        return {success: true,
            value: result
        };
    }

    catch(error){
        console.log("Failed to get shelf item");
        return {success: false,
            reason : "db fail"
        }
    }
}
export const ChangeItemBalance = async (shelfName, amount, item) => {

    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name is not valid"
        }
    }

    const itemData = await GetShelfItem(shelfName, item);


    const newBalance = itemData.value.rows[0].balance + amount;

    const query = `UPDATE "${shelfName}" SET balance = $1 WHERE id = $2`;

    try{
        const result = await db.query(query, [newBalance, itemData.value.rows[0].id]);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to change item balance");
        return {success: false,
            reason : "db fail"
        }
    }



}

export const ChangeItemBalanceViaID = async (shelfName, amount, id) => {

    await ThrowIfDBNotInit();

    if (!(await ShelfNameValid(shelfName))){
        return {success: false,
            reason : "shelf name is not valid"
        }
    }

    const itemData = await GetShelfItemViaID(shelfName, id);


    const newBalance = itemData.value.rows[0].balance + amount;

    const query = `UPDATE "${shelfName}" SET balance = $1 WHERE id = $2`;

    try{
        const result = await db.query(query, [newBalance, id]);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to change item balance");
        return {success: false,
            reason : "db fail"
        }
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
        const result = await db.query(FindUserByUsernameQuery, [username]);
        return {success:true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to query username");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const GetUserPasswordAndSaltWithID = async (userID) => {
    await ThrowIfDBNotInit();

    try{
        const result = await db.query(FindUserPasswordAndSaltQuery, [userID]);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to retrieve user password and salt");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const GetUserPasswordAndSaltWithUsername = async (username) => {
    await ThrowIfDBNotInit();

    const userRow = await GetUser(username);

    try{
        const result = await db.query(FindUserPasswordAndSaltQuery, [userRow.value.rows[0].id]);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to retrieve user password and salt");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const SaveUser = async (user, salt) => {
    await ThrowIfDBNotInit();

    if ((await UserExists(user.Username))){
        return {success: false,
            reason : "user exists"
        }
    }

    try{
        await db.query(SaveUsernameAndLevelQuery, [user.Username, user.Role]);

        const userRow = await GetUser(user.Username);

        const result = await db.query(SavePasswordQuery, [
            userRow.value.rows[0].id,user.Password, salt]);

        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to save user");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const UpdateUserPassword = async (user, salt) => {
    await ThrowIfDBNotInit();

    if (!(await UserExists(user.Username))){
        return {success: false,
            reason : "user does not exist"
        }
    }

    const userRow = await GetUser(user.Username);
    try{
        const result = await db.query(UpdatePasswordQuery, [user.Password, salt, 
            userRow.value.rows[0].id
        ]);
        return {success: true,
            value: result
        };
    }
    catch(error){
        console.log("Failed to update password");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const UpdateUserRole = async (user) => {
    await ThrowIfDBNotInit();

    if (!(await UserExists(user.Username))){
        return {success: false,
            reason : "user does not exist"
        }
    }

    const userRow = await GetUser(user.Username);
    try{
        const result = await db.query(UpdateUserRoleQuery, [user.Role, userRow.value.rows[0].id]);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Failed to update user role");
        return {success: false,
            reason : "db fail"
        }
    }
}

export const DeleteUser = async (user) => {
    await ThrowIfDBNotInit();

    if (!(await UserExists(user.Username))){
        console.log("User does not exist");
        return {success: false,
            reason : "user does not exist"
        }
    }

    const userID = (await GetUser(user.Username)).value.rows[0].id;
    try{
        const result = await db.query(DeleteUserQuery, [userID]);
        return {success: true,
            value: result
        };
    }
    catch (error){
        console.log("Couldn't delete user");
        return {success: false,
            reason : "db fail"
        }
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


