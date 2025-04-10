import * as fs from "node:fs"
import * as path from "path"

export const ReadTextFile = async (path) => {
    return new Promise( (resolve, reject) => {
        fs.readFile(path, "utf8", (error, data) => {
            if (error){
                reject( new Error("Failed to read db credentials"));
            }
            else{
                resolve(data);
            }
        })
        
    })
}