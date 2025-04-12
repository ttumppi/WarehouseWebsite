import * as dbHandler from "../src/db/dbHandler.js"
import {Item} from "../src/models/Item.js"

await dbHandler.ConnectToTestDatabase();
await dbHandler.SetupDatabase();

test("Prints each query seperately", async () => {
    const queries = await dbHandler.GetSplitDBSetupQueries();


    expect(queries.length).toBe(4);
});

test("Create item and query it from db", async () => {
    const item = new Item("testMaker1", "testItem1", "TestSerial");

    await dbHandler.CreateItem(item);

    const items = await dbHandler.GetItems();
    console.log(items);

    expect(items.Result.rows.length).toBe(1);
})