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