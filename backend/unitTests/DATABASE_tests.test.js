import * as dbHandler from "../src/db/dbHandler.js"
import {Item} from "../src/models/Item.js"

await dbHandler.ConnectToTestDatabase();
await dbHandler.SetupDatabase();
await dbHandler.ClearAllTables();

test("Prints each query seperately", async () => {
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



let lastShelf = "a";
let results = [];
for (let i = 0; i < 100; i++){
    lastShelf = await dbHandler.GenerateNewShelfID(lastShelf);
    results.push(lastShelf);
}
console.log(results);