import * as dbHandler from "../src/db/dbHandler.js"
import {Item} from "../src/models/Item.js"

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

    expect(items.rows.length).toBe(1);
})

test("Create shelf and query it from db", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const row = await dbHandler.GetShelf(shelfName);

    expect(row.rows[0].shelf_id).toBe(shelfName);
})

test("Create shelf and item and put the item to the shelf", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const item = new Item("testMaker1", "testItem1", "TestSerial");

    const itemRow = await dbHandler.GetItem(item);

    await dbHandler.AddItemToShelf(shelfName, itemRow.rows[0].id, 20, 15);

    const shelfItems = await dbHandler.GetShelfItems(shelfName);

    expect(shelfItems.rows[0].item_id).toBe(itemRow.rows[0].id);
})


test("Create an item and two shelfs, transfer item from one shelf to another",
     async () => {
        const shelfName = await dbHandler.CreateShelf(50);
        const shelfName2 = await dbHandler.CreateShelf(50);

        const item = new Item("testMaker1", "testItem1", "TestSerial");

        const itemRow = await dbHandler.GetItem(item);

        await dbHandler.AddItemToShelf(shelfName, itemRow.rows[0].id, 20, 15);

        await dbHandler.TransferItem(shelfName, 15, shelfName2, 10);

        const itemID = await dbHandler.GetShelfItem(shelfName2, item);

        expect(itemID.rows.length).toBe(1);


     }
)

test("Change balance of an item from 20 to 15", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const item = new Item("testMaker1", "testItem1", "TestSerial");

    const itemRow = await dbHandler.GetItem(item);

    await dbHandler.AddItemToShelf(shelfName, itemRow.rows[0].id, 20, 15);

    await dbHandler.ChangeItemBalance(shelfName, -5, item);

    const shelfItem = await dbHandler.GetShelfItem(shelfName, item);    

    expect(shelfItem.rows[0].balance).toBe(15);
})

test("Change balance of an item from 20 to 25", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const item = new Item("testMaker1", "testItem1", "TestSerial");

    const itemRow = await dbHandler.GetItem(item);

    await dbHandler.AddItemToShelf(shelfName, itemRow.rows[0].id, 20, 15);

    await dbHandler.ChangeItemBalance(shelfName, 5, item);

    const shelfItem = await dbHandler.GetShelfItem(shelfName, item);    

    expect(shelfItem.rows[0].balance).toBe(25);
})

test("Change self size from 50 to 40", async () => {

    const shelfName = await dbHandler.CreateShelf(50);

    await dbHandler.ChangeShelfSize(shelfName, 40);

    const shelfRow = await dbHandler.GetShelf(shelfName);

    expect(shelfRow.rows[0].size).toBe(40);


})

test("Can't change self size to smaller than existing item's location", 
    async () => {
        const shelfName = await dbHandler.CreateShelf(50);

        const item = new Item("testMaker1", "testItem1", "TestSerial");

        const itemRow = await dbHandler.GetItem(item);

        await dbHandler.AddItemToShelf(shelfName, itemRow.rows[0].id, 20, 50);




        await dbHandler.ChangeShelfSize(shelfName, 40);

        const shelfRow = await dbHandler.GetShelf(shelfName);

        expect(shelfRow.rows[0].size).toBe(50);
    }
)

test("Get available locations from a shelf", async () => {
    const shelfName = await dbHandler.CreateShelf(50);

    const item = new Item("testMaker1", "testItem1", "TestSerial");

        const item2 = new Item("testMaker2", "testItem2", "TestSerial2");

        await dbHandler.CreateItem(item2);

        const itemRow = await dbHandler.GetItem(item);

        const itemRow2 = await dbHandler.GetItem(item2);

        await dbHandler.AddItemToShelf(shelfName, itemRow.rows[0].id, 20, 50);

        await dbHandler.AddItemToShelf(shelfName, itemRow2.rows[0].id, 20, 49);

        const availableLocations = await dbHandler.GetAvailableShelfLocations(
            shelfName
        );

        expect(availableLocations.rows.length).toBe(48);
})

test("Can't create two of the same item", async () => {
    const item = new Item("testMaker22", "testItem22", "TestSerial22");

    await dbHandler.CreateItem(item);
    await dbHandler.CreateItem(item);

    const itemRow = await dbHandler.GetItem(item);

    expect(itemRow.rows.length).toBe(1);

})


let lastShelf = null;
let results = [];
for (let i = 0; i < 1000; i++){
    lastShelf = await dbHandler.GenerateNewShelfID(lastShelf);
    results.push(lastShelf);
}
console.log(`1000 generated shelf ids : ${JSON.stringify(results)}`);