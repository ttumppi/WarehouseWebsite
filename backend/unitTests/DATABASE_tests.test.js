import * as dbHandler from "../src/db/dbHandler.js"
import {Item} from "../src/models/Item.js"
import {User} from "../src/models/User.js"

await dbHandler.ConnectToTestDatabase();
await dbHandler.SetupDatabase();
await dbHandler.ClearAllTables();

test("Check that init query has 4 queries spliced up", async () => {
    const queries = await dbHandler.GetSplitDBSetupQueries();


    expect(queries.length).toBe(4);
});

test("Create item and query it from db", async () => {
    const item = new Item("testMaker1", "testItem1", "TestSerial");

    await dbHandler.CreateItem(item);

    const items = await dbHandler.GetItem(item);

    expect(items.value.rows.length).toBe(1);
})

test("Create shelf and query it from db", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const row = await dbHandler.GetShelf(shelfName.value);

    expect(row.value.rows[0].shelf_id).toBe(shelfName.value);
})

test("Create shelf and item and put the item to the shelf", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const item = new Item("testMaker1", "testItem1", "TestSerial");

    const itemRow = await dbHandler.GetItem(item);

    await dbHandler.AddItemToShelf(shelfName.value, itemRow.value.rows[0].id, 20, 15);

    const shelfItems = await dbHandler.GetShelfItems(shelfName.value);


    expect(shelfItems.value.rows[0].item_id).toBe(itemRow.value.rows[0].id);
})


test("Create an item and two shelfs, transfer item from one shelf to another",
     async () => {
        const shelfName = await dbHandler.CreateShelf(50);
        const shelfName2 = await dbHandler.CreateShelf(50);

        const item = new Item("testMaker1", "testItem1", "TestSerial");

        const itemRow = await dbHandler.GetItem(item);

        await dbHandler.AddItemToShelf(shelfName.value, itemRow.value.rows[0].id, 20, 15);

        await dbHandler.TransferItem(shelfName.value, 15, shelfName2.value, 10);

        const itemID = await dbHandler.GetShelfItem(shelfName2.value, item);

        expect(itemID.value.rows.length).toBe(1);


     }
)

test("Change balance of an item from 20 to 15", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const item = new Item("testMaker1", "testItem1", "TestSerial");

    const itemRow = await dbHandler.GetItem(item);

    await dbHandler.AddItemToShelf(shelfName.value, itemRow.value.rows[0].id, 20, 15);

    await dbHandler.ChangeItemBalance(shelfName.value, -5, item);

    const shelfItem = await dbHandler.GetShelfItem(shelfName.value, item);    

    expect(shelfItem.value.rows[0].balance).toBe(15);
})

test("Change balance of an item from 20 to 25", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const item = new Item("testMaker1", "testItem1", "TestSerial");

    const itemRow = await dbHandler.GetItem(item);

    await dbHandler.AddItemToShelf(shelfName.value, itemRow.value.rows[0].id, 20, 15);

    await dbHandler.ChangeItemBalance(shelfName.value, 5, item);

    const shelfItem = await dbHandler.GetShelfItem(shelfName.value, item);    

    expect(shelfItem.value.rows[0].balance).toBe(25);
})

test("Change self size from 50 to 40", async () => {

    const shelfName = await dbHandler.CreateShelf(50);

    await dbHandler.ChangeShelfSize(shelfName.value, 40);

    const shelfRow = await dbHandler.GetShelf(shelfName.value);

    expect(shelfRow.value.rows[0].size).toBe(40);


})

test("Can't change self size to smaller than existing item's location", 
    async () => {
        const shelfName = await dbHandler.CreateShelf(50);

        const item = new Item("testMaker1", "testItem1", "TestSerial");

        const itemRow = await dbHandler.GetItem(item);

        await dbHandler.AddItemToShelf(shelfName.value, itemRow.value.rows[0].id, 20, 50);




        await dbHandler.ChangeShelfSize(shelfName.value, 40);

        const shelfRow = await dbHandler.GetShelf(shelfName.value);

        expect(shelfRow.value.rows[0].size).toBe(50);
    }
)

test("Get available locations from a shelf", async () => {
    const shelfName = await dbHandler.CreateShelf(50);


    const item = new Item("testMaker1", "testItem1", "TestSerial");

    const item2 = new Item("testMaker2", "testItem2", "TestSerial2");

    await dbHandler.CreateItem(item2);

    const itemRow = await dbHandler.GetItem(item);

    const itemRow2 = await dbHandler.GetItem(item2);

    await dbHandler.AddItemToShelf(shelfName.value, itemRow.value.rows[0].id, 20, 50);

    await dbHandler.AddItemToShelf(shelfName.value, itemRow2.value.rows[0].id, 20, 49);

    const availableLocations = await dbHandler.GetAvailableShelfLocations(
        shelfName.value
    );


    expect(availableLocations.value.rows.length).toBe(48);
})

test("Can't create two of the same item", async () => {
    const item = new Item("testMaker22", "testItem22", "TestSerial22");

    await dbHandler.CreateItem(item);
    await dbHandler.CreateItem(item);

    const itemRow = await dbHandler.GetItem(item);

    expect(itemRow.value.rows.length).toBe(1);

})

test("Create user with admin and worker roles", async () => {
    const admin = new User("admin", "1234", "admin");
    const worker = new User("worker", "12345", "worker");

    await dbHandler.SaveUser(admin, "12345567");
    await dbHandler.SaveUser(worker, "1321435");

    const adminRow = await dbHandler.GetUser(admin.Username);
    const workerRow = await dbHandler.GetUser(worker.Username);

    expect(adminRow.value.rows.length == 1 && workerRow.value.rows.length == 1).toBe(true);

})

test("Cannot create two users with same name", async () => {

    const worker = new User("worker2", "12345", "worker");
    const worker2 = new User("worker2", "12345", "worker");

    await dbHandler.SaveUser(worker, "12345567");
    await dbHandler.SaveUser(worker2, "1321435");

    const workerRow = await dbHandler.GetUser(worker.Username);

    expect(workerRow.value.rows.length).toBe(1);

})

test("Deleting user works", async () => {
    const worker = new User("worker3", "12345", "worker");

    await dbHandler.SaveUser(worker, "11111111");

    await dbHandler.DeleteUser(worker);

    const userRow = await dbHandler.GetUser(worker.Username);

    expect(userRow.value.rows.length).toBe(0);
})

test("User's role can be changed", async () => {
    const worker = new User("worker4", "12345", "worker");

    await dbHandler.SaveUser(worker, "11111111");

    worker.Role = "admin";

    await dbHandler.UpdateUserRole(worker);

    const userRow = await dbHandler.GetUser(worker.Username);

    expect(userRow.value.rows[0].role).toBe("admin");
})

test("User's password can be changed", async () => {
    const worker = new User("worker4", "12345", "worker");

    await dbHandler.SaveUser(worker, "11111111");

    worker.Password = "admin";

    await dbHandler.UpdateUserPassword(worker, "22222222");

    const userRow = await dbHandler.GetUserPasswordAndSaltWithUsername(worker.Username);

    expect(userRow.value.rows[0].value).toBe("admin");
})

test("User's password deletes when user is deleted", async () => {
    const worker = new User("worker3", "12345", "worker");

    await dbHandler.SaveUser(worker, "11111111");
    
    const userRowBeforeDelete = await dbHandler.GetUser(worker.Username);

    await dbHandler.DeleteUser(worker);

    const userRow = await dbHandler.GetUser(worker.Username);
    
    const passwordRow = await dbHandler.GetUserPasswordAndSaltWithID(
        userRowBeforeDelete.value.rows[0].id)

    expect(userRow.value.rows.length == 0 && passwordRow.value.rows.length == 0).toBe(true);
})

test("Test getting shelf's item info from items table", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const item = new Item("testMaker1", "testItem1", "TestSerial");

    const itemRow = await dbHandler.GetItem(item);

    const item2 = new Item("testMaker2", "testItem2", "TestSerial2");

    const itemRow2 = await dbHandler.GetItem(item2);

    await dbHandler.AddItemToShelf(shelfName.value, itemRow.value.rows[0].id, 20, 50);

    await dbHandler.AddItemToShelf(shelfName.value, itemRow2.value.rows[0].id, 20, 49);

    console.log(shelfName);
    const itemInfo = await dbHandler.GetItemInfoForShelfItems(shelfName);

    console.log(itemInfo.reason);

    const itemInfoRows = itemInfo.value.rows;

    const item1ID = itemRow.value.rows[0].id;
    const item2ID = itemRow.value.rows[1].id;


    expect(itemInfoRows[0].id == item1ID && 
        itemInfoRows[1].id == item2ID).toBe(true);
})

let lastShelf = null;
let results = [];
for (let i = 0; i < 1000; i++){
    lastShelf = await dbHandler.GenerateNewShelfID(lastShelf);
    results.push(lastShelf);
}
console.log(`1000 generated shelf ids : ${JSON.stringify(results)}`);