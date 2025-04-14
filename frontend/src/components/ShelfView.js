import React, { useState, useEffect } from "react";



const ShelfView = ({ loginNeeded }) => {

    const [shelfs, setShelfs] = useState([]);
    const [message, setMessage] = useState("");

    const getShelfs = async () => {

        try{
            const shelfsRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelfs`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
    
            const shelfData = await shelfsRes.json();
            if (shelfsRes.status == 401){
                setMessage("Not logged in");
                loginNeeded();
                return;
            }
    
            if (!shelfData.success){
                setMessage(shelfData.message);
                return;
            }
            
            setMessage("");
            setShelfs(shelfData.data)
        }

        catch(error){
            setMessage("Failed to fetch shelfs");
            console.log(`Failed to load page: ${error}`);
        }
        
    }

    useEffect(() => {

        const getShelfsWrapper = async () => {
            await getShelfs();
        }
        
        getShelfsWrapper();
    }, []);

    const handleAddShelf = async () => {

        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
    
            const shelfData = await shelfRes.json();
    
            if (!shelfData.success){
                setMessage(shelfData.message);
            }

            await getShelfs();

        }
        catch(error){
            setMessage(`Failed to create a shelf: ${error}`);

        }
        
    }

    const handleDeleteShelf = async (shelfName) => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({shelf: shelfName})
                });
    
            const shelfData = await shelfRes.json();
    
            if (!shelfData.success){
                setMessage(shelfData.message);
            }

            let modifiedShelfs = shelfs;
            modifiedShelfs.splice(
                modifiedShelfs.indexOf(shelfName), 1);
            
            setShelfs(modifiedShelfs);
            
            await getShelfs();

        }
        catch(error){
            setMessage(`Failed to create a shelf: ${error}`);

        }
    }

    return (
        <div>
            <div className="shelf-header">
                <h2>Shelves</h2>
                <button className="header-button" 
                onClick={handleAddShelf}>Add Shelf</button>
            </div>

            {message && <p>{message}</p>}

            <ul>
                {shelfs.map((shelf) => (
                <li key={shelf.id}>{shelf.shelf_id}
                    <button onClick={ () => {
                        handleDeleteShelf(shelf.shelf_id);
                        }
                        }>Delete</button>
                </li>
                ))}
            </ul>
        </div>
      );
      
}

export default ShelfView;