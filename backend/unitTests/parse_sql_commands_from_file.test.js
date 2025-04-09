import * as dbHandler from "../src/db/dbHandler.js"

const parseFile = async () => {
    return await dbHandler.GetSplitDBSetupQueries();
    
}

test("Prints each query seperately", async () => {
    const queries = await parseFile();

    for (const query of queries){
        console.log(query);
    }

    expect(queries.length).toBe(4);
});