import * as dbHandler from "../src/db/dbHandler.js"

const parseFile = async () => {
    console.log(await dbHandler.GetSplitDBSetupQueries());
}