import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "./StateContext";
import {Queue} from "../queue.js";

const ShelfsView = () => {

    const { setLoginNeeded, role } = useContext(StateContext);
    const [shelfs, setShelfs] = useState([]);
    const [message, setMessage] = useState("");
    const [shelfItems, setShelfItems] = useState({});
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const queue = useRef(new Queue());

    const redirectToSearchPage = () => {
        navigate(`/search/${search}`);
    }

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
                setLoginNeeded();
                return;
            }
    
            if (!shelfData.success){
                setMessage(shelfData.message);
                return;
            }
            
            let shelfItemsCopy = {};
            shelfData.data.map((shelf) => {
                shelfItemsCopy[shelf.shelf_id] = [];
                queue.current.Enqueue(shelf.shelf_id);
            });

            setShelfItems(shelfItemsCopy);
            setMessage("");
            setShelfs(shelfData.data)

            
        }

        catch(error){
            setMessage("Failed to fetch shelfs");
            console.log(`Failed to load page: ${error}`);
        }
        
    }

    const GetShelfItems = async (shelfName) => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelfName}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
    
            const shelfData = await shelfRes.json();

           
            
            if (!shelfData.success){
                setMessage(shelfData.message);
                return;
            }
            
            setMessage("");
            
            let shelfItemsCopy = {};

            for (let item in shelfItems){
                shelfItemsCopy[item] = shelfItems[item];
            }

            shelfItemsCopy[shelfName] = shelfData.items;

            setShelfItems(shelfItemsCopy);
        }

        catch(error){
            setMessage("Failed to fetch shelf items");
            console.log(`Failed to load page: ${error}`);
        }
    }

    useEffect(() => {

        const getShelfsWrapper = async () => {
            await getShelfs();

           
        }
        
        getShelfsWrapper();
    }, []);

    useEffect(() => {
        const wrapper = async () => {
            if (!queue.current.Empty()){
                await GetShelfItems(queue.current.Dequeue());
            }
        }
        wrapper();
    }, [shelfs]);

    useEffect(() => {
        const wrapper = async () => {
            if (!queue.current.Empty()){
                await GetShelfItems(queue.current.Dequeue());
            }
        }
        wrapper();
    }, [shelfItems])

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
                {shelfs.map((shelf) => (
                <li key={shelf.id}>

                    <span className="clickable-shelf"
                        onClick={() => {redirectToShelf(shelf.shelf_id)}}>
                        {shelf.shelf_id}
                    </span>
                    {(role == "Admin" || role == "Warehouse worker") &&
                    <button className="basic-button" onClick={ 
                        () => {handleDeleteShelf
                        (shelf.shelf_id);}}>Delete
                    </button>}
                    
                    <ul>
                        {(Object.keys(shelfItems).length > 0) && shelfItems[shelf.shelf_id].map((item) => (
                            <li key={item.id}> {item.manufacturer} - {item.model} - {item.serial}</li>
                        ))}
                    </ul>
                    
                </li>
                ))}
            </ul>
        </div>
      );
      
}

export default ShelfsView;