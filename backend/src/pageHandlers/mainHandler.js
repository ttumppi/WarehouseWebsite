import * as dbHandler from "../db/dbHandler.js"

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

    let items = result.value.rows;

    for (let i = 0; i < itemsInfo.value.rows.length; i++){
        items[i]["manufacturer"] = itemsInfo.value.rows[i].manufacturer;
        items[i]["model"] = itemsInfo.value.rows[i].model;
        items[i]["serial"] = itemsInfo.value.rows[i].serial;
    }

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

        console.log(req.body.amount, req.body.id);

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