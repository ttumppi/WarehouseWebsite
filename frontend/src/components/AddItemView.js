import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddItemView = ({ loginNeeded }) => {
    const { shelf } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [itemID, setItemID] = useState(null);
    const [location, setLocation] = useState(null);
    const [balance, setBalance] = useState(0);



    const redirectToShelfPage = () => {
        navigate(`/shelf/${shelf}`)
    }
    


    const GetItems = async () => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/item`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });

            if (shelfRes.status == 401){
                setMessage("Not logged in");
                loginNeeded();
                return;
            }
        
            const shelfData = await shelfRes.json();
    
               
        
            if (!shelfData.success){
                setMessage(shelfData.message);
                return;
            }
                
            setMessage("");
                
               
    
            setItems(shelfData.items);
        }
    
        catch(error){
            setMessage("Failed to fetch shelf items");
            console.log(`Failed to load page: ${error}`);
        }
    }

    const GetAvailableLocations = async (shelfName) => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelfName}/locations`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
                });
        

            if (shelfRes.status == 401){
                setMessage("Not logged in");
                loginNeeded();
                return;
            }

            const shelfData = await shelfRes.json();
    
               
        
            if (!shelfData.success){
                setMessage(shelfData.message);
                return;
            }
                
            setMessage("");
                
               
    
            setLocations(shelfData.locations);
        }
    
        catch(error){
            setMessage("Failed to fetch shelf items");
            console.log(`Failed to load page: ${error}`);
        }
    }

    const AddItemToShelf = async () => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelf}/item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    id: itemID,
                    location: location,
                    balance: balance
                })
                });
        
            const shelfData = await shelfRes.json();
    
               
        
            if (!shelfData.success){
                setMessage(shelfData.message);
                return;
            }
                
            setMessage("Item added");
                
            setItemID(null);
            setBalance(0);
            setLocation(null);   
    
            
        }
    
        catch(error){
            setMessage("Failed to fetch shelf items");
            console.log(`Failed to load page: ${error}`);
        }
    }

    
    useEffect(() => {
    
        const getItemsWrapper = async () => {
            await GetItems();
            await GetAvailableLocations(shelf);
        }
    
        getItemsWrapper();
    }, []);



    return (
        <div>
            <div className="shelf-header">
                <h2>Add Item to Shelf: {shelf}</h2>
                <button className="basic-button" 
                    onClick={redirectToShelfPage}>
                        Back
                    </button>
            </div>

            {message && <p>{message}</p>}

            <h3>Select an Item</h3>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <label>
                            <input
                                type="radio"
                                name="selectedItem"
                                value={item.id}
                                checked={itemID === item.id}
                                onChange={() => setItemID(item.id)}/>
                                    {item.manufacturer} - {item.model} - SN: {item.serial}
                        </label>
                    </li>
                ))}
            </ul>

            <h3>Select Location</h3>
            <select
                value={location || ""}
                onChange={(e) => setLocation(e.target.value)}>
                <option value="" disabled>
                    -- Select a location --
                </option>
                {locations.map((loc) => (
                    <option key={loc.num} value={loc.num}>
                        {loc.num}
                    </option>
                ))}
            </select>

            <h3>Set Balance</h3>
            <input
                type="number"
                min="0"
                value={balance}
                onChange={(e) => setBalance(parseInt(e.target.value))}
                />

            <br /><br />
            <button
                disabled={!itemID || !location || balance < 0}
                onClick={AddItemToShelf}>
                    Add Item to Shelf
            </button>
        </div>
    );

}

export default AddItemView;