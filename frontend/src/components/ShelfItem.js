import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ShelfItem = ({ loginNeeded }) => {
    const {shelf, id } = useParams();
    const navigate = useNavigate();

    const [balance, setBalance] = useState(null);
    const [location, setLocation] = useState(null);
    const [currentShelf, setCurrentShelf] = useState(shelf);
    const [shelfs, setShelfs] = useState([]);
    const [locations, setLocations] = useState(null);
    const [item, setItem] = useState(null);
    const [message, setMessage] = useState("");

    let initialBalance = null;
    let initialShelf = shelf;
    let initialLocation = null;


    const RedirectToShelfView = () => {
        navigate(`shelf/${currentShelf}`);
    }

    const GetItem = async () => {
        const shelfRes = await fetch(
            `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelf}/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
            });

        if (shelfRes.status == 401){
            setMessage("not logged in");
            loginNeeded();
            return;
        }

        const shelfData = await shelfRes.json();

        if (!shelfData.success){
            setMessage("Failed to get item data");
            return;
        }

        setItem(shelfData.item);


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


    const TransferItem = async () => {
        try{
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelf}/item/transfer`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    currentLocation : initialLocation,
                    targetShelf: currentShelf,
                    targetLocation: location
                })
                });

            const shelfData = await shelfRes.json();

            if (!shelfData.success){
                setMessage("Failed to transfer item");
                return;
            }

            setMessage("");
        }
        catch(error){
            setMessage("Failed to transfer item");
            console.log(`Failed to transfer item: ${error}`);
        }
    }

    const UpdateBalance = async () => {
        try{

            const balanceChange = balance - initialBalance;
            const shelfRes = await fetch(
                `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/shelf/${shelf}/item/balance`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    amount: balanceChange,
                    id: id
                })
                });

            const shelfData = await shelfRes.json();

            if (!shelfData.success){
                setMessage("Failed to update balance");
                return;
            }

            setMessage("");

            
        }
        catch(error){
            setMessage("Failed to update balance");
            console.log("Failed to update balance")
        }
    }

    const UpdateItem = async () => {
        if (initialBalance != balance){
            await UpdateBalance();
        }
        if (initialShelf != currentShelf || initialLocation != location){
            await TransferItem();
        }
        setMessage("Saved");
        await GetItem();
    }


    return (
        <div>

            <button className="default-button"
            onClick={RedirectToShelfView} >Back</button>
            <h3>Manufacturer</h3>
            <p>{item?.manufacturer}</p>
            <h3>Model</h3>
            <p>{item?.model}</p>
            <h3>Serial</h3>
            <p>{item?.serial}</p>

            <select
                value={currentShelf}
                onChange={(e) => setCurrentShelf(e.target.value)}>
                {shelfs.map((shelf) => (
                    <option key={shelf.id} value={shelf.shelf_id}>
                        {shelf.shelf_id}
                    </option>
                ))}
            </select>

            <select
                value={location || ""}
                onChange={(e) => setLocation(e.target.value)}>
                <option value="" disabled>
                    -- Select a location --
                </option>
                {(locations == null) ? {} : locations[currentShelf].map((loc) => (
                    <option key={loc.num} value={loc.num}>
                        {loc.num}
                    </option>
                ))}
            </select>

            <h3>Set Balance</h3>
            <input
                type="number"
                min="0"
                value={(balance == null) ? 0 : balance}
                onChange={(e) => setBalance(parseInt(e.target.value))}
                />

            <br /><br />
            <button
                disabled={(initialBalance == balance)
                     && (initialLocation == location)
                      && (initialShelf == shelf)}
                onClick={UpdateItem}>
                    Save
            </button>
        </div>
    )

}



export default ShelfItem;