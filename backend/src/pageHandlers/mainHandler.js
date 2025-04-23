import * as dbHandler from "../db/dbHandler.js"
import { Item } from "../models/Item.js"

export const GetShelfs = async (req, res) => {
    const shelfsResult = await dbHandler.GetAllShelfs();

    if (!shelfsResult.success){
        return res.status(404).json({
            success: false,
            message: shelfsResult.reason}
        );
    }

    if (shelfsResult.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "no shelfs exist"}
        );
    }

    return res.status(200).json({success: true,
        data: shelfsResult.value.rows
    });

}

export const CreateShelf = async (req, res) => {
    const result = await dbHandler.CreateShelf(50);

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason}
        );
    }

    

    return res.status(200).json({success: true
    });

}

export const DeleteShelf = async (req, res) => {
    const result = await dbHandler.DeleteShelf(req.body.shelf);

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason}
        );
    }

    

    return res.status(200).json({
        success: true,
        result: result.value.rows
    });

}

const addItemsInfoToShelfRow = (items, shelfRows) => {
    let successfullLoops = 0;
    let i = 0;
    while (successfullLoops < shelfRows.length){
        
        if (shelfRows[successfullLoops].item_id == items[i].id){
            shelfRows[successfullLoops]["manufacturer"] = items[i].manufacturer;
            shelfRows[successfullLoops]["model"] = items[i].model;
            shelfRows[successfullLoops]["serial"] = items[i].serial;
            i = 0;
            successfullLoops++;
            continue;
        }
        i++;
    }
    return shelfRows;
}

export const GetShelfItems = async (req, res, shelf) => {
    const result = await dbHandler.GetShelfItems(shelf);

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason}
        );
    }

    if (result.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "no items in shelf"}
        );
    }

    const itemsInfo = await dbHandler.GetItemInfoForShelfItems(shelf);


    const items = await addItemsInfoToShelfRow(
        itemsInfo.value.rows, result.value.rows)

    

    return res.status(200).json({
        success: true,
        items: items
    });
}

export const GetShelfAvailableLocations = async (req, res, shelf) => {
    const result = await dbHandler.GetAvailableShelfLocations(shelf);

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason}
        );
    }

    return res.status(200).json({
        success: true,
        locations: result.value.rows
    });
}

export const AddItemToShelf = async (req, res, shelf) => {
    const result = await dbHandler.AddItemToShelf(
        shelf, req.body.id, req.body.balance, req.body.location
    );

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason}
        );
    }

    return res.status(200).json({
        success: true
    });
}

export const DeleteItemFromShelf = async (req, res, shelf) => {
    const result = await dbHandler.DeleteItemFromShelf(shelf, req.body.location);

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason}
        );
    }

    return res.status(200).json({
        success: true
    });
    
}

export const GetShelfItem = async (req,  res, shelf, id) => {
    const result = await dbHandler.GetShelfItemViaID(shelf, id);

    if (!result.success){
        return res.status(404).json({
            success:false,
            message: result.reason
        });
    }

    if (result.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "No item found"
        });
    }

    return res.status(200).json({
        success: true,
        item: result.value.rows[0]
    })
}

export const TransferItem = async (req, res, shelf) => {
    const transferResult = await dbHandler.TransferItem(
        shelf, req.body.currentLocation, req.body.targetShelf,
        req.body.targetLocation);

    if (!transferResult.success){
        return res.status(404).json({
            success: false,
            message: transferResult.reason
        });
    }

    return res.status(200).json({
        success: true
    });
}

export const ChangeItemBalance = async (req, res, shelf) => {
    const balanceResult = await dbHandler.ChangeItemBalanceViaID(
        shelf, req.body.amount, req.body.id);


        if (!balanceResult.success){
            return res.status(404).json({
                success: false,
                message: balanceResult.reason
            });
        }
    
        return res.status(200).json({
            success: true
        });
}

export const GetShelfSize = async (req, res, shelf) => {
    const result = await dbHandler.GetShelfSize(shelf);
    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason
        })
    }


    if (result.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "No size found"
        })
    }

    return res.status(200).json({
        success: true,
        size: result.value.rows[0].size
    });
}

export const ChangeShelfSize = async (req, res, shelf, size) => {
    const result = await dbHandler.ChangeShelfSize(shelf, size);

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason
        })
    }

    return res.status(200).json({
        success: true,
    })


}

export const Search = async (req, res, criteria) => {
    const itemsResult = await dbHandler.SearchItems(criteria);

    if (!itemsResult.success){
        return res.status(404).json({
            success: false,
            message: itemsResult.reason
        });
    }

    if (itemsResult.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "No matching items found"
        });
    }

    const shelfsResult = await dbHandler.GetAllShelfs();

    if (!shelfsResult.success){
        return res.status(404).json({
            success: false,
            message: shelfsResult.reason
        });
    }

    if (shelfsResult.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "No shelfs found"
        });
    }

    const matchingItems = itemsResult.value.rows;
    const shelfs = shelfsResult.value.rows;


  

    // {shelf_id: [rows]}
    let shelfItems = {};

    // loop through each shelf {shelf_id : a, size : 50}
    for (let i = 0; i < shelfs.length; i++){

        shelfItems[shelfs[i].shelf_id] = [];
        // loop through each item that  matches search pattern 
        // {id: 1, manufacturer: something}
        for (let itemi = 0; itemi < matchingItems.length; itemi++){


            const currentItem = matchingItems[itemi];

            // get items from shelf that match current item id
            // {id: 1, location: 2, balance: 20}
            const shelfItemResult = await dbHandler.GetShelfItem( 
                shelfs[i].shelf_id, 
            new Item(currentItem.manufacturer,
                 currentItem.model, currentItem.serial));

            
            
            if (!shelfItemResult.success){
                continue;
            }

            let shelfItemRows = shelfItemResult.value.rows;
            if (shelfItemRows.length == 0){
                continue;
            }

            // add item attributes to each item found from shelf
            for (let rowi = 0; rowi < shelfItemRows.length; rowi++){
                shelfItemRows[rowi]["manufacturer"] = currentItem.manufacturer;
                shelfItemRows[rowi]["model"] = currentItem.model;
                shelfItemRows[rowi]["serial"] = currentItem.serial;
            }

            // merge existing array with shelfItemRows
            shelfItems[shelfs[i].shelf_id].push(...shelfItemRows);
            
        }

       
    }

    return res.status(200).json({
        success: true,
        data: shelfItems
    });

    
}

export const GetAllShelfsAndShelfItems = async (req, res) => {
    const shelfsResult = await dbHandler.GetAllShelfs();

    if (!shelfsResult.success){
        return res.status(404).json({
            success : false,
            message: shelfsResult.reason
        });
    }

    if (shelfsResult.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "Couldn't find any shelfs"
        });
    }

    let shelfsAndItems = {};


    for (shelf of shelfsResult.value.rows){

        const itemsResult = await dbHandler.GetItemInfoForShelfItems(shelf.shelf_id);

        if (!itemsResult.success){
            return res.status(404).json({
                success: false,
                message: itemsResult.reason
            });
        }

        shelfsAndItems[shelf.shelf_id] = itemsResult.value.rows;
    }
    

    return res.status(200).json({
        success: true,
        data: shelfsAndItems
    });
}