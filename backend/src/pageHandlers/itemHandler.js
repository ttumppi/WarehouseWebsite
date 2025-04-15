import * as dbHandler from "../db/dbHandler.js"
import { Item } from "../models/Item.js"

export const CreateItem = async (req, res) => {
    const item = new Item(
        req.body.manufacturer, req.body.model, req.body.serial);

    const result = await dbHandler.CreateItem(item);

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason}
        );
    }

    

    return res.status(200).json({
        success:  true
    });

}

export const GetItems = async (req, res) => {
    const result = await dbHandler.GetItems();

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason}
        );
    }

    if (result.value.rows.length == 0){
        return res.status(404).json({
            success: false,
            message: "No items"
        });
    }

    return res.status(200).json({
        success: true,
        items: result.value.rows
    });
}

export const GetItem = async (req, res, id) => {
    const result = await dbHandler.GetItemByID(id);

    if (!result.success){
        return res.status(404).json({
            success: false,
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

export const DeleteItem = async (req, res, id) => {
    const result = await dbHandler.DeleteItemViaID(id);

    if (!result.success){
        return res.status(404).json({
            success: false,
            message: result.reason
        });
    }

    return res.status(200).json({
        success: true
    });
}