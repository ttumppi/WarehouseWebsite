import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "./StateContext";

const ShelfsView = () => {

    const { setLoginNeeded, role } = useContext(StateContext);
    const [message, setMessage] = useState("");
    const [shelfItems, setShelfItems] = useState({});
    const [search, setSearch] = useState("");

    const navigate = useNavigate();


    const redirectToSearchPage = () => {
        navigate(`/search/${search}`);
    }

   
    const GetShelfItems = async () => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelfs-and-items`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
    
            const shelfData = await shelfRes.json();

           
            
            if (!shelfData.success){

                setShelfItems({});
                setMessage(shelfData.message);
                return;
            }
            
            setMessage("");
            
           setShelfItems(shelfData.data);
        }

        catch(error){
            setMessage("Failed to fetch shelf items");
            console.log(`Failed to load page: ${error}`);
        }
    }

    useEffect(() => {

        const getShelfsWrapper = async () => {
            await GetShelfItems();

           
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



    const redirectToCreateItem = () => {
        navigate("/items");
    }

    const redirectToShelf = (shelf) => {
        navigate(`/shelf/${shelf}`);
    }

    

    return (
        <div>
            

            <div className="shelf-header">
                <h2>Shelves</h2>
                {(role == "Admin" || role == "Warehouse worker") &&
                <button className="header-button" 
                    onClick={handleAddShelf}>Add Shelf
                </button>}
                {(role == "Admin" || role == "Warehouse worker") &&
                <button className="header-button" 
                    onClick={ redirectToCreateItem}>
                    Item page
                </button>}

                <input
                type="text"
                    placeholder="Search For Item"
                    value={search}
                    onChange={e => setSearch(e.target.value)}>
                </input>
                <button onClick={redirectToSearchPage}>
                    Search
                </button>
            </div>

            

            {message && <p>{message}</p>}

            <ul>
                {Object.keys(shelfItems).map((shelf) => ( 
                    <li key={shelf}>

                        <span className="clickable-shelf"
                            onClick={() => {redirectToShelf(shelf)}}>
                            {shelf}
                        </span>
                        {(role == "Admin" || role == "Warehouse worker") &&
                        <button className="basic-button" onClick={ 
                            () => {handleDeleteShelf
                            (shelf);}}>Delete
                        </button>}
                        
                        <ul>
                            
                            {shelfItems[shelf].map((item) => (
                                    <li key={item.id}>
                                         {item.manufacturer} - {item.model} - {item.serial}
                                    </li>
                                ))    
                                
                            }
                        </ul>
                    
                </li>
                ))}
            </ul>
        </div>
      );
      
}

export default ShelfsView;