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
    console.log(shelf);
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
        items[i][manufacturer] = itemsInfo.value.rows[i].manufacturer;
        items[i][model] = itemsInfo.value.rows[i].model;
        items[i][serial] = itemsInfo.value.rows[i].serial;
    }

    return res.status(200).json({
        success: true,
        items: items
    });
}